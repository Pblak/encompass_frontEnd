// set an interface for gender type
import {toast} from "vue3-toastify";

export interface GenderType {
    male: "male";
    female: "female";
}

export const toCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value)
}
export const toastFromResponse = (response: any) => {
    if (response.data && response.data._t) {

        toast(response.data.message, {
            type: response.data._t,
            position: 'top-right',
        })
    } else {
        return "An error occurred"
    }
}