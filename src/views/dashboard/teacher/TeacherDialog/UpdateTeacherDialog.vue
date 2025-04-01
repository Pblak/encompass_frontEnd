<template>
  <v-tooltip text="Update teacher" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary"
             density="comfortable" icon="fa fa-edit !_text-sm"
             @click="toggleDialog = true"></v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Update teacher {{ selectedTeacher.name }}
      </template>
      <template v-slot:text>
        <UpdateTeacherForm
            :push-data="attemptSave"
            :selected-teacher="selectedTeacher"
            eventForValidate="update-teacher-event"></UpdateTeacherForm>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Update" variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import UpdateTeacherForm from "@/views/dashboard/teacher/TeacherDialog/UpdateTeacherForm.vue";
import {useTeacher, exeGlobalGetTeachers} from "@/api/useTeacher";
import {useEventBus} from "@vueuse/core";
import {teacherState, TeacherType} from "@/stats/teacherState";

const {TeacherList} = teacherState();
defineProps<{
  selectedTeacher: TeacherType
}>();

const {useUpdateTeacher} = useTeacher();
const {onResultSuccess: onSuccessUpdateTeacher, execute: exeUpdateTeacher} = useUpdateTeacher();
const toggleDialog = ref(false)
const {emit} = useEventBus('update-teacher-event');


const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {

  exeUpdateTeacher({
    data: res.data
  });
}
onSuccessUpdateTeacher((res) => {
  let result =  res.data.result
  toggleDialog.value = false;
  TeacherList.value = TeacherList.value.map((teacher) => {
    if (teacher.id ===  result.id) {
      teacher = {...teacher, ...result};
    }
    return teacher;
  })
})
</script>
