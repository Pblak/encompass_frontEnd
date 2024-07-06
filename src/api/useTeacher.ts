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
