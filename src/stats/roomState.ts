import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";
import {ref} from "vue";

export interface RoomType {
    id: number;
    name: string;
    capacity: number;
    notes: string;
    [key: string]: any;
}
export const  roomState = createGlobalState(() => {
    const RoomList =ref<RoomType[]>([])
    // const RoomList = useStorage("roomList", [], undefined, {serializer: StorageSerializers.object})

    return {
        RoomList,
    };

});
