import {useApi} from "./useApi";

export function useParent(){

    const  useCreateParent = ()=> {
        const q = useApi(
            "/createParent",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetParents = ()=> {
        return useApi(
            "/getParents",
            {
                method: "GET",
            }, {
                immediate: true,
            })
    }

    const useGetParent = ()=> {
        return useApi(
            "/getParent",
            {
                method: "GET",
            }, {
                immediate: false,
            })
    }

    const useUpdateParent = ()=> {
        const q = useApi(
            "/updateParent",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    const useDeleteParent =()=>{
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
export const {
    execute: exeGlobalGetParents,
    onResultSuccess: onSucGlobalGetParents,
} = useGetParents()
