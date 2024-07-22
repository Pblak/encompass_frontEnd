import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  roomState = createGlobalState(() => {
    const RoomList = useStorage("roomList", [], undefined, {serializer: StorageSerializers.object})

    return {
        RoomList,
    };

});
