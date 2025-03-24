import {headers, useApi} from "./useApi";


export function useParent() {
    
    const useCreateParent = () => {
        
        const q = useApi(
            "/createParent",
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
    
    const useGetParents = () => {
        return useApi(
            "/getParents",
            {
                method: "GET",
            }, {
                immediate: true,
            })
    }
    
    const useGetParent = () => {
        const q = useApi(
            "/getParent/:id",
            {
                method: "GET",
            }, {
                immediate: false,
            })
        const execute = ({params}: any) => {
            return q.execute({
                params,
            });
        }
        return {
            ...q,
            execute,
        }
    }
    
    const useUpdateParent = () => {
        const q = useApi(
            "/updateParent",
            {
                method: "post",
            }, {
                immediate: false,
            })
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
    
    const useDeleteParent = () => {
        return useApi(
            "/deleteParent",
            {
                method: "POST",
            }, {
                immediate: false,
            })
    }
    
    return {
        useCreateParent,
        useGetParents,
        useGetParent,
        useUpdateParent,
        useDeleteParent,
    }
}

/**
 * the use of the globalUseGetParents
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetParents} = useParent();
const {
    execute: exeGlobalGetParents,
    onResultSuccess: onSucGlobalGetParents,
} = useGetParents()

export {
    exeGlobalGetParents,
    onSucGlobalGetParents
}
