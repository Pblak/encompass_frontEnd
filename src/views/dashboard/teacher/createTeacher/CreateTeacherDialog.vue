<template>
  <v-tooltip text="Create teacher" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"></v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title> Create teacher</template>
      <template v-slot:text>
        <CreateTeacherForm :push-data="attemptSave" eventForValidate="create-teacher-event"></CreateTeacherForm>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Create" variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import CreateTeacherForm from "@/views/dashboard/teacher/createTeacher/CreateTeacherForm.vue";
import {useTeacher, exeGlobalGetTeachers} from "@/api/useTeacher";
import {useEventBus} from "@vueuse/core";

const {useCreateTeacher} = useTeacher();
const {onResultSuccess: onSuccessCreateTeacher, execute: exeCreateTeacher} = useCreateTeacher();
const toggleDialog = ref(false)
const {emit} = useEventBus('create-teacher-event');
const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {
  exeCreateTeacher({
    data: res.data
  });
}
onSuccessCreateTeacher(() => {
  toggleDialog.value = false;
  exeGlobalGetTeachers();
})
</script>
