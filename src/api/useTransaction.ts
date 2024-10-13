import {headers, useApi} from "./useApi";

export function useTransaction() {

    const useCreateTransaction = () => {
        // send instrument.name instrument.image
        const q = useApi(
            "/createTransaction",
            {
                method: "POST",
            }, {
                immediate: false,
            });
        const execute = ({data}: any) => {
            // headers['Content-Type'] = 'multipart/form-data';
            return q.execute({
                headers: headers,
                data: data,
            });
        };
        return {
            ...q,
            execute,
        }
    }

    const useGetTransactions = () => {
        return useApi(
            "/getTransactions",
            {
                method: "GET",
            }, {
                immediate: true,
            })
    }

    const useGetTransaction = () => {
        return useApi(
            "/getTransaction",
            {
                method: "GET",
            }, {
                immediate: false,
            })
    }

    const useUpdateTransaction = () => {
        const q = useApi(
            "/updateTransaction",
            {
                method: "POST",
            }, {
                immediate: false,
            });
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

    return {
        useCreateTransaction,
        useGetTransactions,
        useGetTransaction,
        useUpdateTransaction,
    }
}
/**
 * the use of the globalUseGetTransactions
 * is when the "execute" is triggered in the component
 * you can listen to the "onResultSuccess" from another all component
 * @constructor
 */
const {useGetTransactions} = useTransaction();
const {
    execute: exeGlobalGetTransactions,
    onResultSuccess: onSucGlobalGetTransactions,
} = useGetTransactions()

export {
    exeGlobalGetTransactions,
    onSucGlobalGetTransactions,
}
