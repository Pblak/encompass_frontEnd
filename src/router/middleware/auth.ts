import type {RouteLocationNormalized, Router} from 'vue-router';
import {loginState} from '@/stats/loginState';

interface MiddlewareContext {
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
    next: () => Promise<void>; // Ensure next is a Promise-returning function
    router: Router;
    params?: string[];
}


export default async function auth({to, from, next, router, params}: MiddlewareContext) {
    // console.log('auth middleware called with to:', to, 'from:', from, 'params:', params)
    const {isLogin, userLogin} = loginState();
    // console.log('isLogin', isLogin, 'userLogin', userLogin)
    if (!isLogin || !userLogin.value) {
        await router.push({name: 'Login'});
        // console.log('You are not logged in')
        return false
    }
    if (params && !params.includes(userLogin.value.accountType)) {
        // console.log('You are not allowed to access this page', params);
        // console.log('You are not allowed to access this page' , params);
        return Promise.reject(false)
    }
    // console.log('You are allowed to access this page')
    // console.log('--------')
    // Continue to the next middleware or route
    return next();
}
