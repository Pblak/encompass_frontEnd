import auth from '@/router/middleware/auth';

const middlewareRegistry: { [key: string]: Function } = {
    auth,
    // Add other middleware functions here
};

export default middlewareRegistry;