import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";
import {ref} from "vue";

export interface RoomType {
    name: string;
    capacity: number;
    notes: string;
}
export const  roomState = createGlobalState(() => {
    const RoomList =ref([])
    // const RoomList = useStorage("roomList", [], undefined, {serializer: StorageSerializers.object})

    return {
        RoomList,
    };

});
