import type {RouteLocationNormalized, Router } from 'vue-router';

interface MiddlewareContext {
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
    next: () => Promise<void>; // Ensure next is a Promise-returning function
    router: Router;
    params?: string[];

}

export function middlewarePipeline(
    context: MiddlewareContext,
    middleware: Function[],
    index: number
): Promise<void> {
    const nextMiddleware = middleware[index];

    if (!nextMiddleware) return Promise.resolve(); // Resolve if no more middleware

    return new Promise((resolve, reject) => {
        // Define a function to call the next middleware
        // console.log(`Executing middleware at index ${index} for route: ${String(context.to.name)}`);

        const nextPipeline = async () => {
            await middlewarePipeline(context, middleware, index + 1)
                .then(()=>{
                // console.log(`Proceeding to next middleware at index ${index + 1}`);

                return resolve();
                })
                .catch((error)=>{
                    // console.error(`Error in middleware at index ${index + 1}:`, error);
                    return reject(error);
                });

        };

        try {
            // Call the current middleware with the modified next function
            nextMiddleware({...context, next: nextPipeline}).catch(reject);
        } catch (error) {
            // console.error(`Exception in middleware at index ${index}:`, error);
            return reject(error);
        }
    });
}

export function parseMiddleware(middlewareWithParams: string) {
    const [name, params] = middlewareWithParams.split(':');
    const parsedParams = params ? params.split('|') : [];
    return {name, parsedParams};
}
