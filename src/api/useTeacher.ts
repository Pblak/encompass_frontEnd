import {headers, useApi} from "./useApi";

export function useTeacher() {

    const useCreateTeacher = () => {
        const q = useApi(
            "/createTeacher",
            {
                method: "POST",
            }, {
                immediate: false,
            })
        const execute = ({data}: any) => {
            headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                data,
                headers: headers
            });
        }
        return {
            ...q,
            execute,
        }
    }

    const useGetTeachers = () => {
        return useApi(
            "/getTeachers",
            {
                method: "GET",
            }, {
                immediate: true,
            })
    }

    const useGetTeacher = () => {
        return useApi(
            "/getTeacher",
            {
                method: "GET",
            }, {
                immediate: false,
            })
    }

    const useUpdateTeacher = () => {
        const q = useApi(
            "/updateTeacher",
            {
                method: "POST",
            }, {
                immediate: false,
            })
        const execute = ({data}: any) => {
            headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                data,
                headers: headers
            });
        }
        return {
            ...q,
            execute,
        }

    }
    const useDeleteTeacher = () => {
        return useApi(
            "/deleteTeacher",
            {
                method: "POST",
            }, {
                immediate: false,
            });
    }

    return {
        useCreateTeacher,
        useGetTeachers,
        useGetTeacher,
        useUpdateTeacher,
        useDeleteTeacher
    }
}

/**
 * the use of the globalUseGetTeachers
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetTeachers} = useTeacher();
const {
    execute: exeGlobalGetTeachers,
    onResultSuccess: onSucGlobalGetTeachers,
} = useGetTeachers()

export {
    exeGlobalGetTeachers,
    onSucGlobalGetTeachers,
}
