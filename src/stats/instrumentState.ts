import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  instrumentState = createGlobalState(() => {
    const InstrumentList = useStorage("instrumentList", [], undefined, {serializer: StorageSerializers.object})

    return {
        InstrumentList,
    };

});
