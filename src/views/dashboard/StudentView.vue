<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <div class="_flex _gap-2 _items-center">
        <CreateStudentDialog/>
        <p>
          Student List
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" density="compact" flat hide-details
                    label="Search" prepend-inner-icon="fa-thin fa-search" single-line variant="solo-filled">
      </v-text-field>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table v-model:search="search" :header-props="{dense: true}" :headers="headers" :items="StudentList">
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <td class="_font-black">
              <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.text }}</span>
              <template v-if="isSorted(column)">
                <v-icon :icon="getSortIcon(column)"></v-icon>
              </template>
            </td>
          </template>
        </tr>
      </template>
      <template v-slot:item.created_at="{ value }">
        <p>
          <v-tooltip activator="parent" location="top">{{ moment(value).format('MMMM Do YYYY, h:mm:ss a') }}</v-tooltip>
          {{ moment(value).format('LLL') }}
        </p>
      </template>
      <template v-slot:item.infos="{value }">
        <div class="_flex _flex-col _gap-1 _text-xs">
          <div class="_whitespace-nowrap">{{ value.phone1 }}</div>
          <div class="_whitespace-nowrap">{{ value.phone2 }}</div>
        </div>
      </template>
      <template v-slot:item.infos.address="{ item }">
        {{ item.infos.address.street }}, {{ item.infos.address.city }}, {{ item.infos.address.state }},
        {{ item.infos.address.zip }}
      </template>
      <template v-slot:item.actions="{item}">
        <div class="_flex _gap-3">
          <!--               <v-btn color="error" density="compact" icon-->
          <!--                      variant="tonal">-->
          <!--                  <v-icon class="fa-duotone fa-trash" size=""></v-icon>-->
          <!--               </v-btn>-->
          <v-btn color="primary" density="compact" icon :to='{name:"StudentDetails",params:{student_id:item.id}}'
                 variant="tonal">
            <v-icon class="fa-duotone fa-arrow-up-right-from-square" size=""></v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useStudent, exeGlobalGetStudents} from "@/api/useStudent";
import CreateStudentDialog from "@/views/dashboard/student/createStudent/CreateStudentDialog.vue";
import {studentState} from "@/stats/studentState";

import moment from "moment";


const {useGetStudents, useCreateStudent} = useStudent();
const {onResultSuccess: onSuccessCreateStudent, execute: exeCreateStudent} = useCreateStudent();
const {StudentList} = studentState();
const toggleDialog = ref(false)
const headers = [
  // {text: 'ID', key: 'id'},
  {text: 'Full Name', key: 'name'},
  {text: 'Email', key: 'email'},
  {text: 'Phones', key: 'infos'},
  {text: 'Parent', key: 'parent.name'},
  {text: 'Address', key: 'infos.address'},
  {text: 'Created At', key: 'created_at'},
  {text: 'actions', key: 'actions'}
];

onMounted(() => {
  exeGlobalGetStudents();

})
const search = ref("")
</script>
