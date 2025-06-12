<template>
    <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
        <div class="_flex _flex-wrap _gap-4">
            <v-select v-model="transactionForm.lesson_id" :items="filterLesson" item-value="id"
                      :item-title="getItemTitle" label="Lessons" variant="solo" density="comfortable">
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                        <v-list-item-subtitle>Teacher - {{ item.raw.teacher.name }}</v-list-item-subtitle>
                        <template #append>
                            <v-chip color="success">
                                {{ toCurrency(item.raw.price) }}
                            </v-chip>
                        </template>
                    </v-list-item>
                </template>
            </v-select>
        </div>
        <div class="_flex _flex-wrap _gap-4">
            <v-text-field v-model="transactionForm.amount" :rules="$rules('required|number'+maxAmountRule, 'Amount')"
                          density="comfortable" label="Amount" class="!_flex-1" variant="solo"
            ></v-text-field>
            <v-select v-model="transactionForm.payment_method"
                      :items="['cash', 'visa', 'mastercard', 'paypal']"
                      :rules="$rules('required', 'Payment Method')"
                      class="!_flex-1 !_capitalize" density="comfortable" variant="solo"
                      label="Payment Method"></v-select>
        </div>
        <div class="_flex _flex-wrap _gap-4">
            <v-textarea v-model="transactionForm.notes" class="!_flex-1"
                        density="comfortable" label="Notes" variant="solo"></v-textarea>
        </div>
        <div class="_flex _flex-wrap _gap-4">
            <div id="paypalCheckout">
                <div id="paypal-button-container"></div>
            </div>
        </div>
    </v-form>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {exeGlobalGetLessons} from "@/api/useLesson";
import {lessonState, type LessonType} from "@/stats/lessonState";
// import {exeGlobalGetTransactions, onSucGlobalGetTransactions} from "@/api/useTransaction";
import type {TransactionType} from "@/stats/transactionState";
import {useEventBus} from "@vueuse/core";
import {usePaypal} from "@/api/usePaypal";
import {toCurrency} from "@/stats/Utils";
import {loadScript, type PayPalButtonsComponentOptions, type PayPalScriptOptions} from "@paypal/paypal-js";
// import {toast} from "vue3-toastify";

type PushDataType = (data: any) => void;
const props = defineProps<{
    eventForValidate: string,
    lesson_id?: number,
    createOrder: PushDataType;
    approuveOrder: PushDataType;
    // setLoader?: (val: boolean) => void;
}>();

const {LessonList} = lessonState();
const {useCreatePaypalOrder, useCapturePaypalOrder} = usePaypal()
const {on} = useEventBus(props.eventForValidate as unknown as string);
const ElForm = ref<any>(null);
// const {
//     execute: exeCreatePaypalOrder,
// } = useCreatePaypalOrder()
// const {execute: exeCapturePaypalOrder} = useCapturePaypalOrder()
const transactionForm = ref<TransactionType>({
    // id: 0,
    amount: 0,
    lesson_id: props.lesson_id ? props.lesson_id : 0,
    payment_method: "paypal",
    notes: "",
})

const getItemTitle = (item: LessonType) => {
    return typeof item == 'object' ? `${item.student.name} - ${item.instrument.name}` : ''
}
const validateForm = async () => {
    const {valid} = await ElForm.value.validate()
    if (!valid) return;

    // props.pushData({
    //     validate: valid,
    //     data: {...transactionForm.value}
    // });
};

const filterLesson = computed(() => {
    return LessonList.value.filter((item: LessonType) => {
        return item.price - item.payed_price > 0
    })
})

const maxAmountRule = computed(() => {
    if (transactionForm.value.lesson_id) {
        let lessonSelected = LessonList.value.find((item: any) => item.id === transactionForm.value.lesson_id)
        let max = lessonSelected!.price - lessonSelected!.payed_price
        return `|max:${max}`
    } else {
        return ''
    }
})

const initPaypalPayment = () => {
    loadScript({
        clientId: import.meta.env.VITE_CLIENT_PAYPAL_ID,
        currency: "USD",
    } as PayPalScriptOptions).then((paypal) => {
        if (paypal && "Buttons" in paypal) {
            if (paypal.Buttons) {
                paypal.Buttons({
                    style: {
                        color: 'blue',
                        shape: 'rect',
                        layout: 'horizontal',
                        tagline: 'false',
                        height: 40
                    },
                    createOrder: async () => {
                        await validateForm();
                        return props.createOrder({...transactionForm.value}) as Promise<string>
                    },
                    onApprove: async (data) => {
                        props.approuveOrder({...data, ...transactionForm.value})
                    }
                } as PayPalButtonsComponentOptions).render('#paypal-button-container');
            }
        }
    })

}

onMounted(() => {
    // on(() => {
    //     validateForm();
    // });
    exeGlobalGetLessons({})
    initPaypalPayment()
})
// onSucGlobalGetTransactions(() => {
//     props.setLoader && props.setLoader(false)
//     exeGlobalGetLessons({})
// })
// watch(() => transactionForm.value.lesson_id, (val) => {
//
// })
</script>
