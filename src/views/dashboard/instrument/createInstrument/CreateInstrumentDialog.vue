<template>
  <v-tooltip text="Create student" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"  color="primary" icon="fa fa-plus"  @click="toggleDialog = true"></v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Create student
      </template>
      <template v-slot:text>
<!--        <CreateStudentForm :push-data="attemptSave" eventForValidate="create-student-event"></CreateStudentForm>-->
        <CreateInstrumentForm :push-data="attemptSave" :eventForValidate="eventBusName"/>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Create" variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useInstrument, exeGlobalGetInstruments} from "@/api/useInstrument";
import {useEventBus} from "@vueuse/core";
import CreateInstrumentForm from "@/views/dashboard/instrument/createInstrument/CreateInstrumentForm.vue";

const {useCreateInstrument} = useInstrument();
const {
  onResultSuccess: onSuccessCreateInstrument,
  execute: exeCreateInstrument
} = useCreateInstrument();
const toggleDialog = ref(false)
const eventBusName = 'create-instrument-event';
const {emit} = useEventBus(eventBusName);
const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {
  exeCreateInstrument({
    data: res.data
  });
}
onSuccessCreateInstrument(() => {
  toggleDialog.value = false;
  exeGlobalGetInstruments();
})
</script>
