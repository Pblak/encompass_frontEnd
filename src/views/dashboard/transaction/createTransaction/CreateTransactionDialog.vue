<template>
  <v-tooltip text="Create parent" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"> </v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Create transaction
      </template>
      <template v-slot:text>
        <CreateTransactionForm :push-data="attemptSave" eventForValidate="create-transaction-event"/>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Create " variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import CreateTransactionForm from "@/views/dashboard/transaction/createTransaction/CreateTransactionForm.vue";
import {useTransaction ,exeGlobalGetTransactions} from "@/api/useTransaction";
import {useEventBus} from "@vueuse/core";

const {useCreateTransaction} = useTransaction();
const {
  onResultSuccess: onSuccessCreateTransaction,
  execute: exeCreateTransaction
} = useCreateTransaction();
const toggleDialog = ref(false)
const {emit} = useEventBus('create-transaction-event');
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
})
</script>
