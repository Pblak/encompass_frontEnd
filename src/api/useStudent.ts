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
