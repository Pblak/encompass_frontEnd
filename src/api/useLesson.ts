import {headers, useApi} from "./useApi";

export function useLesson() {

    const useCreateLesson = () => {
        // send instrument.name instrument.image
        const q = useApi("/createLesson", {
            method: "POST",
        }, {
            immediate: false,
        });
        const execute = ({data}: any) => {
            // headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                headers: headers, data: data,
            });
        };
        return {
            ...q, execute,
        }
    }

    const getLessonsByParent = () => {
        const q = useApi("/getLessonsByParent", {
            method: "POST",
        }, {
            immediate: true,
        });

        const execute = (data: {
            parent_id?: number,
        }) => {

            return q.execute({
                data: {data},
            });
        };
        return {
            ...q, execute,
        }
    }

    const useGetLessons = () => {
        const q = useApi("/getLessons", {
            method: "GET",
        }, {
            immediate: true,
        });
        return q
    }

    const useGetLesson = () => {
        const q = useApi("/getLesson", {
            method: "GET",
        }, {
            immediate: false,
        });
        return q
    }

    const useUpdateLesson = () => {
        const q = useApi("/updateLesson", {
            method: "POST",
        }, {
            immediate: false,
        });
        const execute = ({data}: any) => {
            headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                data, headers: headers
            });
        }
        return {
            ...q, execute,
        }
    }

    return {
        useCreateLesson, useGetLessons, useGetLesson, useUpdateLesson, getLessonsByParent
    }
}

/**
 * the use of the globalUseGetLessons
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetLessons} = useLesson();
export const {
    execute: exeGlobalGetLessons, onResultSuccess: onSucGlobalGetLessons,
} = useGetLessons()

