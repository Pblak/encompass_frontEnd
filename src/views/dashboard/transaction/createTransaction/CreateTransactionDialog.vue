<template>
   <v-tooltip v-if="!props.disableToggleBtn" location="bottom" text="Create parent">
      <template v-slot:activator="{ props }">
         <v-btn color="primary" icon="fa fa-plus" v-bind="props" @click="toggleDialog = true"></v-btn>
      </template>
   </v-tooltip>
   <v-dialog v-model="toggleDialog" scrollable width="auto">
      <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
         <template v-slot:title>
            Create transaction
         </template>
         <template v-slot:text>
            <CreateTransactionForm :push-data="attemptSave" :lesson_id="selectedLessonId"
                                   eventForValidate="create-transaction-event"/>
         </template>
         <template v-slot:actions>
            <v-btn class="ms-auto" color="success" text="Create " variant="tonal" @click="sendEvent"></v-btn>
         </template>
      </v-card>
   </v-dialog>
</template>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import CreateTransactionForm from "@/views/dashboard/transaction/createTransaction/CreateTransactionForm.vue";
import {exeGlobalGetTransactions, useTransaction} from "@/api/useTransaction";
import {exeGlobalGetLessons} from "@/api/useLesson";
import {useEventBus} from "@vueuse/core";

const props = defineProps<{
   lesson_id?: number,
   disableToggleBtn?: boolean,
   toggleTransactionDialog?: boolean
}>();
const {useCreateTransaction} = useTransaction();
const toggleDialog = ref(false);
const selectedLessonId= ref(props.lesson_id);
const {emit} = useEventBus('create-transaction-event');
const {on} = useEventBus('toggle-transaction-dialog-event');
const {
   onResultSuccess: onSuccessCreateTransaction,
   execute: exeCreateTransaction
} = useCreateTransaction();

const sendEvent = () => {
   emit();
};

const attemptSave = (res) => {
   exeCreateTransaction({
      data: res.data
   });
}
onSuccessCreateTransaction(() => {
   toggleDialog.value = false;
   exeGlobalGetTransactions();
   exeGlobalGetLessons();
})
onMounted(()=>{
   on((res) => {
      selectedLessonId.value = res.lesson.id
      toggleDialog.value=!toggleDialog.value;
   });
})
// watch(()=>props.toggleTransactionDialog,()=>{
//    toggleDialog.value = props.toggleTransactionDialog;
// })
</script>
