<template>
  <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
    <div class="_flex _flex-wrap _gap-4">
      <v-select v-model="transactionForm.lesson_id"
                :items="LessonList" item-value="id"
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
  </v-form>
</template>
<script lang="ts" setup>
import type {TransactionType} from "@/stats/transactionState";
import {computed, onMounted, ref, watch} from "vue";
import {useEventBus} from "@vueuse/core";
import {exeGlobalGetLessons, useLesson} from "@/api/useLesson";
import {lessonState} from "@/stats/lessonState";
import {toCurrency} from "@/stats/Utils";

type PushDataType = (data: { validate: boolean, data: TransactionType }) => void;
const {LessonList} = lessonState();
const props = defineProps<{
  eventForValidate: string,
  lesson_id?: number,
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const transactionForm = ref<TransactionType>({
  id: 0,
  amount: 0,
  lesson_id: props.lesson_id ? props.lesson_id : 0,
  payment_method: "",
  notes: "",
})

const getItemTitle = (item: any) => {
  return typeof item == 'object' ? `${item.student.name} - ${item.instrument.name}` : ''
}
const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid,
    data: {...transactionForm.value}
  });

};
const maxAmountRule = computed(() => {
  return transactionForm.value.lesson_id ?
      `|max:${LessonList.value.find((item: any) => item.id === transactionForm.value.lesson_id)!.price}` : ''
})

onMounted(() => {
  on(() => {
    validateForm();
  });
  exeGlobalGetLessons()
})
watch(() => transactionForm.value.lesson_id, (val) => {

})
</script>
