// set an interface for gender type
import {toast} from "vue3-toastify";
import {attemptAccess} from "@/router/middleware/core/accessRouteChack";
import router from '@/router';
import type {_RouteRecordBase, RouteLocationNormalized} from "vue-router";
export interface GenderType {
    male: "male";
    female: "female";
}

export const toCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value)
}
export const toastFromResponse = (response: any) => {
    if (response.data && response.data._t) {

        toast(response.data.message, {
            type: response.data._t,
            position: 'top-right',
        })
    } else {
        return "An error occurred"
    }
}
export const  findRouteByName = (routes: _RouteRecordBase[]
                                 , name: string): _RouteRecordBase | null => {
    for (const route of routes) {
        if (route.name === name) {
            return route;
        }
        if (route.children) {
            const childRoute = findRouteByName(route.children, name);
            if (childRoute) {
                return childRoute;
            }
        }
    }
    return null;
}
export const  canGoTo = async (route: { name: string })=> {
    try {
        let r = findRouteByName(router.getRoutes(), route.name) as RouteLocationNormalized;
        console.log(`Checking access for route: ${route.name}`);
        const result = await attemptAccess(r).then(r=>r).catch(e=>e)
        console.log('attemptAccess succeeded:', result);
        return result;
    } catch (error) {
        console.error('attemptAccess failed:', error);
        return false;
    }
}