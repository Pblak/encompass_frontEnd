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
