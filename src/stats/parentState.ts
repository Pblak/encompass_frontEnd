import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  parentState = createGlobalState(() => {
    const ParentList = useStorage("parentList", [], undefined, {serializer: StorageSerializers.object})

    return {
        ParentList,
    };

});
