import {useApi} from "./useApi";

export function useStudent(){

    const  useCreateStudent = ()=> {
        const q = useApi(
            "/createStudent",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    const useGetStudents = ()=> {
        const q = useApi(
            "/getStudents",
            {
                method: "GET",
            },{
                immediate:true,
            });
        return q
    }

    const useGetStudent = ()=> {
        const q = useApi(
            "/getStudent",
            {
                method: "GET",
            },{
                immediate:false,
            });
        return q
    }

    const useUpdateStudent = ()=> {
        const q = useApi(
            "/updateStudent",
            {
                method: "PUT",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreateStudent,
        useGetStudents,
        useGetStudent,
        useUpdateStudent,
    }
}

/**
 * the use of the globalUseGetStudents
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetStudents} = useStudent();
export const {
    execute: exeGlobalGetStudents,
    onResultSuccess: onSucGlobalGetStudents,
} = useGetStudents()
