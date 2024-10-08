import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const calendarState = createGlobalState(() => {
    // const EventList = useStorage("EventList", [], undefined, {serializer: StorageSerializers.object})
    const rangeSelected = useStorage("rangeSelected", null);

    return {
        rangeSelected
    };
});
