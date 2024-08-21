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


/**
 * the use of the globalUseGetRooms
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetRooms} = useRoom();
export const {
    execute: exeGlobalGetRooms,
    onResultSuccess: onSucGlobalGetRooms,
} = useGetRooms()
