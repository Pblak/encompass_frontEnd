import {headers, useApi} from "./useApi";

export function usePackage() {
    const useCreatePackage = () => {
        // send package.name package.image
        const q = useApi(
            "/createPackage",
            {
                method: "POST",
            }, {
                immediate: false,
            });
        const execute = ({data}: any) => {
            headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                data,
                headers: headers
            });
        };
        return {
            ...q,
            execute,
        }
    }

    const useGetPackages = () => {
        const q = useApi(
            "/getPackages",
            {
                method: "GET",
            }, {
                immediate: true,
            });
        return q
    }

    const useGetPackage = () => {
        const q = useApi(
            "/getPackage",
            {
                method: "GET",
            }, {
                immediate: false,
            });
        return q
    }

    const useUpdatePackage = () => {
        const q = useApi(
            "/updatePackage",
            {
                method: "POST",
            }, {
                immediate: false,
            });
        const execute = ({data}: any) => {
            headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                data,
                headers: headers
            });
        }
        return {
            ...q,
            execute,
        }
    }

    return {
        useCreatePackage,
        useGetPackages,
        useGetPackage,
        useUpdatePackage,
    }
}

/**
 * the use of the globalUseGetPackages
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetPackages} = usePackage();
export const {
    execute: exeGlobalGetPackages,
    onResultSuccess: onSucGlobalGetPackages,
} = useGetPackages()

