import {createGlobalState, useStorage, StorageSerializers} from "@vueuse/core";


export const  studentState = createGlobalState(() => {
    const StudentList = useStorage("studentList", [], undefined, {serializer: StorageSerializers.object})


    return {
        StudentList,
    };

});
