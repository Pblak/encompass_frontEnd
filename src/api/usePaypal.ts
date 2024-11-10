import {useApi} from "./useApi";

export function usePaypal(){

    const  useCreatePaypalOrder = ()=> {
        const q = useApi(
            "/createPaypalOrder",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }
    const useCapturePaypalOrder = ()=> {
        const q = useApi(
            "/capturePaypalOrder",
            {
                method: "POST",
            },{
                immediate:false,
            });
        return q
    }

    return {
        useCreatePaypalOrder,
        useCapturePaypalOrder,
    }
}
