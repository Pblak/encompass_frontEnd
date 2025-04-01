<template>
  <v-card class="_flex-1 !_flex _flex-col">
    <v-card-title class="d-flex align-center pe-2">
      <div class="_flex _gap-2 _items-center">
        <CreateTeacherDialog/>
        <p>
          Teacher List
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" size="25" flat icon>
            <v-icon size="20">fa fa-grip-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link @click="toggleWithTrash">
            <template v-slot:prepend>
              <div class="_pr-2">
                <v-switch :model-value="withTrashTeacher" color="primary" hide-details></v-switch>
              </div>
            </template>
            <template #title>
              Show deleted
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-divider class="border-opacity-75"></v-divider>
    <v-card-text class="_flex-1">
      <teacher-table></teacher-table>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";
import {exeGlobalGetTeachers} from "@/api/useTeacher";
import CreateTeacherDialog from "@/views/dashboard/teacher/TeacherDialog/CreateTeacherDialog.vue";
import {teacherState} from "@/stats/teacherState";
import TeacherTable from "@/components/teacher/teacherTable.vue";

const {withTrashTeacher} = teacherState();
const toggleWithTrash = () => {
  withTrashTeacher.value = !withTrashTeacher.value;
}

onMounted(() => {
  exeGlobalGetTeachers();
})
</script>
