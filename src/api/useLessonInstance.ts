import {useApi} from "./useApi";

export function useLessonInstance() {

    const useUpdateLessonInstance = () => {
        const q = useApi("/updateLessonInstance", {
            method: "POST",
        }, {
            immediate: false,
        });
        const execute = ({data}: any) => {
            return q.execute({
                data
            });
        }
        return {
            ...q, execute,
        }
    }
    // get teacher's lesson instances
    const useGetTeacherLessonInstances = () => {
        const q = useApi("/getTeacherLessonInstances", {
            method: "post",
        }, {
            immediate: false,
        });
        const execute = ({data}: any) => {
            return q.execute({
                data
                // Add any necessary parameters here
            });
        }
        return {
            ...q, execute,
        }
    }

    // get student's lesson instances
    const useGetStudentLessonInstances = () => {
        const q = useApi("/getStudentLessonInstances", {
            method: "post",
        }, {
            immediate: false,
        });
        const execute = ({data}: any) => {
            return q.execute({
                data
            });
        }
        return {
            ...q, execute,
        }
    }

    return {
        useUpdateLessonInstance,
        useGetTeacherLessonInstances,
        useGetStudentLessonInstances
    }
}
