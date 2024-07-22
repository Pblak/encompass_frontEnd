import {useApi} from "./useApi";

export function useRoom(){

    const  useCreateRoom = ()=> {
        const q = useApi(
            "/createRoom",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetRooms = ()=> {
        const q = useApi(
            "/getRooms",
            {
                method: "GET",
            },{
                immediate:true,
            });
        return q
    }

    const useGetRoom = ()=> {
        const q = useApi(
            "/getRoom",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateRoom = ()=> {
        const q = useApi(
            "/updateRoom",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateRoom,
        useGetRooms,
        useGetRoom,
        useUpdateRoom,
    }
}
