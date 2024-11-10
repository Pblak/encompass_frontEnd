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
        return useApi(
            "/getRooms",
            {
                method: "GET",
            }, {
                immediate: true,
            })
    }

    const useGetRoom = ()=> {
        return useApi(
            "/getRoom",
            {
                method: "GET",
            }, {
                immediate: false,
            })
    }

    const useUpdateRoom = ()=> {
        return useApi(
            "/updateRoom",
            {
                method: "POST",
            }, {
                immediate: false,
            })
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
const {
    execute: exeGlobalGetRooms,
    onResultSuccess: onSucGlobalGetRooms,
} = useGetRooms()

export {
    exeGlobalGetRooms,
    onSucGlobalGetRooms,
}
