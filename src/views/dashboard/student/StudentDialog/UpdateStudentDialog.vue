<template>
  <v-tooltip text="Update student" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" density="comfortable" icon="fa fa-edit !_text-sm" @click="toggleDialog = true"></v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Update student {{ selectedStudent.name }}
      </template>
      <template v-slot:text>
        <UpdateStudentForm
            :push-data="attemptSave"
                           :selected-student="selectedStudent"
                           eventForValidate="update-student-event"></UpdateStudentForm>

      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Update" variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import UpdateStudentForm from "@/views/dashboard/student/StudentDialog/UpdateStudentForm.vue";
import {useStudent} from "@/api/useStudent";
import {useEventBus} from "@vueuse/core";
import {studentState, StudentType} from "@/stats/studentState";
const {StudentList} = studentState();

defineProps<{
    selectedStudent: StudentType
}>();

const {useUpdateStudent} = useStudent();
const {onResultSuccess: onSuccessUpdateStudent, execute: exeUpdateStudent} = useUpdateStudent();
const toggleDialog = ref(false)
const {emit} = useEventBus('update-student-event');


const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {

  exeUpdateStudent({
    data: res.data
  });
}
onSuccessUpdateStudent((res) => {
  toggleDialog.value = false;
  StudentList.value = StudentList.value.map((student) => {
    if (student.id === res.data.result.id) {
      student = {...student, ...res.data.result};
    }
    return student;
  });

})
</script>
