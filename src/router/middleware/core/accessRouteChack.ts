import {type RouteLocationNormalized} from 'vue-router';
import middlewareRegistry from './middlewareRegistry';
import {middlewarePipeline, parseMiddleware} from './middlewarePipeline';
import router from "@/router";


export async function attemptAccess(route: RouteLocationNormalized): Promise<boolean> {

    console.log('Attempting access for route:', route.name);

    if (!route.meta || !route.meta.middleware) {
        console.log('No middleware, access granted.');
        return true;
    }

    const middleware = (route.meta.middleware as string[]).map((middlewareWithParams) => {
        const {name, parsedParams} = parseMiddleware(middlewareWithParams);
        const middlewareFunction = middlewareRegistry[name];
        if (!middlewareFunction) {
            return () => Promise.resolve(); // No-op middleware
        }
        return (context: any) => middlewareFunction({...context, params: parsedParams});
    });

    const context = {
        to: route,
        from: route,
        next: () => Promise.resolve(),
        router
    };

    console.log('Executing middleware pipeline');
    return await middlewarePipeline(context, middleware, 0)
        .then(() => {
            console.log('Middleware pipeline succeeded');
            return true;
        }).catch((error) => {
            console.error('Middleware pipeline failed:', error);

            return false;
        });

}
