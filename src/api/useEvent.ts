import {useApi} from "./useApi";

export function useEvent() {

    const useCreateEvent = ()=> {
        const q = useApi(
            "/createEvent",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetEvents = ()=> {
        const q = useApi(
            "/getEvents",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useGetEvent = ()=> {
        const q = useApi(
            "/getEvent",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateEvent = ()=> {
        const q = useApi(
            "/updateEvent",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateEvent,
        useGetEvents,
        useGetEvent,
        useUpdateEvent,
    }
}
