import { headers, useApi} from "./useApi";

export function useInstrument() {

    const useCreateInstrument = () => {
        // send instrument.name instrument.image
        const q = useApi(
            "/createInstrument",
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
        };
        return {
            ...q,
            execute,
        }
    }

    const useGetInstruments = () => {
        const q = useApi(
            "/getInstruments",
            {
                method: "GET",
            }, {
                immediate: true,
            });
        return q
    }

    const useGetInstrument = () => {
        const q = useApi(
            "/getInstrument",
            {
                method: "GET",
            }, {
                immediate: false,
            });
        return q
    }

    const useUpdateInstrument = () => {
        const q = useApi(
            "/updateInstrument",
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
        useCreateInstrument,
        useGetInstruments,
        useGetInstrument,
        useUpdateInstrument,
    }
}