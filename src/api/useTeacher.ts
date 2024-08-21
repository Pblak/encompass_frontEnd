import {useApi} from "./useApi";

export function useTeacher(){

    const  useCreateTeacher = ()=> {
        const q = useApi(
            "/createTeacher",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetTeachers = ()=> {
        const q = useApi(
            "/getTeachers",
            {
                method: "GET",
            },{
                immediate:true,
            });
        return q
    }

    const useGetTeacher = ()=> {
        const q = useApi(
            "/getTeacher",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateTeacher = ()=> {
        const q = useApi(
            "/updateTeacher",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateTeacher,
        useGetTeachers,
        useGetTeacher,
        useUpdateTeacher,
    }
}
/**
 * the use of the globalUseGetTeachers
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetTeachers} = useTeacher();
export const {
    execute: exeGlobalGetTeachers,
    onResultSuccess: onSucGlobalGetTeachers,
} = useGetTeachers()
