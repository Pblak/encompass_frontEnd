import axios from 'axios';
import {loginState} from "@/stats/loginState.js";
import {useAxios  , type UseAxiosOptions } from "@vueuse/integrations/useAxios";
import {createEventHook, whenever} from "@vueuse/core";
import {computed, ref} from "vue";
import {el} from "vuetify/locale";

const {loginToken} = loginState();
const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': `Bearer ${loginToken.value}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Credentials': 'true',

    },
});

interface ApiConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
    headers?: any;
}

export function useApi(path: string, config:ApiConfig, options : UseAxiosOptions) {
    const query = useAxios(path, config, apiInstance, options);
    const onResultSuccess = createEventHook();
    const onResultError = createEventHook();
    const resultData = ref(null);

    whenever(query.isFinished, () => {

        if (query.response.value && query.response.value.status >= 200 && query.response.value.status < 300) {
            resultData.value = query.response.value.data;
            onResultSuccess.trigger(query.response.value.data);

        } else {
            onResultError.trigger(query.response.value ? query.response.value.data : query.error.value);
        }
    });

    return {
        ...query,
        onResultSuccess: onResultSuccess.on,
        onResultError: onResultError.on,
        resultData
    }
}
