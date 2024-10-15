<template>
    <v-tooltip v-if="!props.disableToggleBtn" location="bottom" text="Create parent">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" icon="fa fa-plus" v-bind="props" @click="toggleDialog = true"></v-btn>
        </template>
    </v-tooltip>
    <v-dialog v-model="toggleDialog" scrollable width="auto">
        <v-card prepend-icon="fa-duotone fa-graduation-cap"
                width="600" :loading="loading" :disabled="loading">
            <template v-slot:loader="{ isActive }">
                <v-progress-linear
                    :active="isActive"
                    color="primary"
                    height="5"
                    indeterminate
                ></v-progress-linear>
            </template>
            <template v-slot:title>
                Create transaction
            </template>
            <template v-slot:text>
                <CreateTransactionForm :createOrder="onCreateOrder"
                                       :approuveOrder="onApprouveOrder"
                                       :lesson_id="selectedLessonId"
                                       eventForValidate="create-transaction-event"/>
            </template>
            <template v-slot:actions>
                <!--            <v-btn class="ms-auto" color="success" text="Create " variant="tonal" @click="sendEvent"></v-btn>-->
            </template>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import CreateTransactionForm from "@/views/dashboard/transaction/createTransaction/CreateTransactionForm.vue";
import {exeGlobalGetTransactions, onSucGlobalGetTransactions, useTransaction} from "@/api/useTransaction";
// import {exeGlobalGetLessons} from "@/api/useLesson";
import {useEventBus} from "@vueuse/core";
import {toast} from "vue3-toastify";
import {usePaypal} from "@/api/usePaypal";

const {useCreatePaypalOrder, useCapturePaypalOrder} = usePaypal()
const props = defineProps<{
    lesson_id?: number,
    disableToggleBtn?: boolean,
    toggleTransactionDialog?: boolean
}>();
// const {useCreateTransaction} = useTransaction();
const toggleDialog = ref(false);
const selectedLessonId = ref(props.lesson_id);
const {on} = useEventBus('toggle-transaction-dialog-event');
// const {
//    onResultSuccess: onSuccessCreateTransaction,
//    execute: exeCreateTransaction
// } = useCreateTransaction();
const {
    execute: exeCreatePaypalOrder,
} = useCreatePaypalOrder()

const {
    execute: exeCapturePaypalOrder,
} = useCapturePaypalOrder()

const loading = ref(false);

// const sendEvent = () => {
//    emit();
// };



const onCreateOrder = (transactionForm) => {
    console.log('transactionForm  ', transactionForm)
    loading.value = true;
    return exeCreatePaypalOrder({
        data: transactionForm
    }).then((response) => {
        console.log('response  ', response)
        return response.data
    }).then((order: any) => {
        console.log('order  ', order.value)
        return order.value.id
    }).catch((err) => {
        console.log('err  ', err)
        loading.value = false;
        toast('Error while creating order',
            {
                type: 'error',
                position: 'top-right',
                transition: "flip",
                dangerouslyHTMLString: true
            })
    });
}
const onApprouveOrder = (data) => {
    // console.log('onApprove', data)
    exeCapturePaypalOrder({
        data: data
    }).then(() => {
        // console.log(res)
        toggleDialog.value = false;
        loading.value = false;
        exeGlobalGetTransactions();
    })
}

// const attemptSave = (res) => {
// exeCreateTransaction({
//    data: res.data
// });
// }

// onSuccessCreateTransaction(() => {
//
//    exeGlobalGetTransactions();
//    exeGlobalGetLessons();
// })
onMounted(() => {
    on((res) => {
        selectedLessonId.value = res.lesson.id
        toggleDialog.value = !toggleDialog.value;
    });
})
</script>
