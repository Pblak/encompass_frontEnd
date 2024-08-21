<template>
  <v-tooltip text="Create student" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"></v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Create student
      </template>
      <template v-slot:text>
        <CreateStudentForm :push-data="attemptSave" eventForValidate="create-student-event"></CreateStudentForm>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Create" variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import CreateStudentForm from "@/views/dashboard/student/createStudent/CreateStudentForm.vue";
import {useStudent, exeGlobalGetStudents} from "@/api/useStudent";
import {useEventBus} from "@vueuse/core";

const {useCreateStudent} = useStudent();
const {onResultSuccess: onSuccessCreateStudent, execute: exeCreateStudent} = useCreateStudent();
const toggleDialog = ref(false)
const {emit} = useEventBus('create-student-event');
const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {
  exeCreateStudent({
    data: res.data
  });
}
onSuccessCreateStudent(() => {
  toggleDialog.value = false;
  exeGlobalGetStudents();
})
</script>
