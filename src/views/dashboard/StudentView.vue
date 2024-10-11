<template>
  <v-card class="_flex-1 !_flex _flex-col">
    <v-card-title class="d-flex align-center pe-2">
      <div class="_flex _gap-2 _items-center">
        <CreateStudentDialog/>
        <p>
          Student List
        </p>
      </div>
      <v-spacer></v-spacer>
      <!--      <v-text-field v-model="search" density="compact" flat hide-details-->
      <!--                    label="Search" prepend-inner-icon="fa-thin fa-search"-->
      <!--                    single-line variant="solo-filled">-->
      <!--      </v-text-field>-->
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
                <v-switch :model-value="withTrashStudent" color="primary" hide-details></v-switch>
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
      <student-table></student-table>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";
import {exeGlobalGetStudents} from "@/api/useStudent";
import CreateStudentDialog from "@/views/dashboard/student/createStudent/CreateStudentDialog.vue";
import {studentState} from "@/stats/studentState";
import StudentTable from "@/components/student/studentTable.vue";

const {withTrashStudent} = studentState();
const toggleWithTrash = () => {
  withTrashStudent.value = !withTrashStudent.value;
}

onMounted(() => {
  exeGlobalGetStudents();
})
</script>
