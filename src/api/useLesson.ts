import { headers, useApi} from "./useApi";

export function useLesson() {

    const useCreateLesson = () => {
        // send instrument.name instrument.image
        const q = useApi(
            "/createLesson",
            {
                method: "POST",
            }, {
                immediate: false,
            });
        const execute = ({data}: any) => {
            // headers['Content-Type'] = 'multipart/form-data';
            return  q.execute({
                headers: headers,
                data:data,
            });
        };
        return {
            ...q,
            execute,
        }
    }

    const useGetLessons = () => {
        const q = useApi(
            "/getLessons",
            {
                method: "GET",
            }, {
                immediate: true,
            });
        return q
    }

    const useGetLesson = () => {
        const q = useApi(
            "/getLesson",
            {
                method: "GET",
            }, {
                immediate: false,
            });
        return q
    }

    const useUpdateLesson = () => {
        const q = useApi(
            "/updateLesson",
            {
                method: "POST",
            }, {
                immediate: false,
            });
        const execute = ({data}: any) => {
            headers['Content-Type'] = 'multipart/form-data';
            return  q.execute({
                data,
                headers: headers
            });
        }
        return {
            ...q,
            execute,
        }
    }

    return {
        useCreateLesson,
        useGetLessons,
        useGetLesson,
        useUpdateLesson,
    }
}
