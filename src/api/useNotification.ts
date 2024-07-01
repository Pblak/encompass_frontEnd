import {useApi} from "./useApi";

export function useNotification(){

    const  useCreateNotification = ()=> {
        const q = useApi(
            "/createNotification",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetNotifications = ()=> {
        const q = useApi(
            "/getNotifications",
            {
                method: "GET",
            },{
                immediate:true,
            });
        return q
    }

    const useGetNotification = ()=> {
        const q = useApi(
            "/getNotification",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateNotification = ()=> {
        const q = useApi(
            "/updateNotification",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateNotification,
        useGetNotifications,
        useGetNotification,
        useUpdateNotification,
    }
}
