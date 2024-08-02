import {computed} from "vue";
import axios, {type RawAxiosRequestConfig} from "axios";
import {useAxios, type UseAxiosOptions} from "@vueuse/integrations/useAxios";
import {createEventHook, whenever} from "@vueuse/core";
import {toastFromResponse} from "@/stats/Utils";
import {loginState} from "@/stats/loginState";


export interface APIError {
    code: number;
    message: string;
    data: {
        name: string;
        debug: string;
        message: string;
        arguments: string[];
        exception_type: string;
        context: any;
    };
}

type ApiResult<T> = { response: T } | { error: APIError };

export interface ACKResponse {
    done: boolean;
}

const {loginToken} = loginState();
export const headers = {
    'Authorization': `Bearer ${loginToken.value}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',

    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
}
export const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: headers
});

apiInstance.interceptors.response.use(
    (response) => {
        toastFromResponse(response);
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export function useApi<T>(
    path = "",
    config: RawAxiosRequestConfig<any> = {},
    options: UseAxiosOptions & { initialData?: any } = {
        immediate: true,
        shallow: true,
        initialData: undefined,
    }
) {

    const query = useAxios<ApiResult<T>>(path, config, apiInstance, options);

    const onResultSuccess = createEventHook<T>();
    const onResultError = createEventHook<APIError>();
    const onErrorString = createEventHook<string>();

    const result = computed<T>(() => {
        if (query.data.value && "result" in query.data.value)
            return query.data.value.result;

        return options.initialData;
    });

    const resultError = computed<APIError | undefined>(() => {
        if (query.data.value && "error" in query.data.value)
            return query.data.value.error;
        return undefined;
    });

    // const errorString = computed<string | undefined>(() => {
    //     if (resultError.value !== undefined) return resultError.value.data.message;
    //     if (query.error.value ) return query.error.value.message;
    //     return undefined;
    // });

    whenever(query.isFinished, () => {
        // console.log(query)
        // if (errorString.value !== undefined) {
        //     onErrorString.trigger(errorString.value);
        // }
        if (query.response.value !== undefined &&
            query.response.value.status <= 300 &&
            query.response.value.status >= 200) {
            return onResultSuccess.trigger(query.response.value as any);
        }

        // if (
        //     onResultError.trigger(query.data.value.error);
        // }
    });

    return {
        ...query,
        result,
        resultError,
        // errorString,
        onResultSuccess: onResultSuccess.on,
        onResultError: onResultError.on,
        onErrorString: onErrorString.on,
    };
}
