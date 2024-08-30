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

    return {
        useUpdateLessonInstance,
    }
}
