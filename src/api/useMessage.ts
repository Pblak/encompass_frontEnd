import {useApi} from "./useApi";

export function useMessage(){

    const  useCreateMessage = ()=> {
        const q = useApi(
            "/createMessage",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetMessages = ()=> {
        const q = useApi(
            "/getMessages",
            {
                method: "GET",
            },{
                immediate:true,
            });
        return q
    }

    const useGetMessage = ()=> {
        const q = useApi(
            "/getMessage",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateMessage = ()=> {
        const q = useApi(
            "/updateMessage",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateMessage,
        useGetMessages,
        useGetMessage,
        useUpdateMessage,
    }
}
