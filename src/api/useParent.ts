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
        const q = useApi(
            "/getParents",
            {
                method: "GET",
            },{
                immediate:true,
            });
        return q
    }

    const useGetParent = ()=> {
        const q = useApi(
            "/getParent",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
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

    return {
        useCreateParent,
        useGetParents,
        useGetParent,
        useUpdateParent,
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
