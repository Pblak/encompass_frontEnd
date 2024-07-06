<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <v-btn color="primary" icon="fa fa-plus" @click="toggleDialog = true"></v-btn>
            <p>
               Student List
            </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field v-model="search" density="compact" flat hide-details
                       label="Search" prepend-inner-icon="fa-thin fa-search" single-line variant="solo-filled">
         </v-text-field>
         <v-dialog v-model="toggleDialog" scrollable width="auto">
            <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
               <template v-slot:title>
                  Create student
               </template>
               <template v-slot:text>
                  <Form-create-student :push-data="attemptSave"
                                       eventForValidate="create-student-event"></Form-create-student>
               </template>
               <template v-slot:actions>
                  <v-btn class="ms-auto" color="success" text="Create " variant="tonal" @click="sendEvent"></v-btn>
               </template>
            </v-card>
         </v-dialog>
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
         <template v-slot:item.infos.phone="{ value }">
            {{ value }}
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
import {useStudent} from "@/api/useStudent";
import {useEventBus} from "@vueuse/core";
import {studentState} from "@/stats/studentState";
import FormCreateStudent from "@/components/_FormCreateStudent.vue";
import moment from "moment";

const {emit} = useEventBus('create-student-event');
const {useGetStudents, useCreateStudent} = useStudent();
const {execute: exeGetStudents, onResultSuccess: onSuccessGetStudents,} = useGetStudents()
const {onResultSuccess: onSuccessCreateStudent, execute: exeCreateStudent} = useCreateStudent();
const {StudentList} = studentState();
const toggleDialog = ref(false)
const headers = [
   // {text: 'ID', key: 'id'},
   {text: 'Full Name', key: 'name'},
   {text: 'Email', key: 'email'},
   {text: 'Phone ', key: 'infos.phone'},
   {text: 'Address', key: 'infos.address'},
   {text: 'Created At', key: 'created_at'},
   {text: 'actions', key: 'actions'}
];
const sendEvent = () => {
   emit();
};
const attemptSave = (res) => {
   exeCreateStudent({
      data: res.data
   });
}
onMounted(() => {
   exeGetStudents();
   onSuccessCreateStudent((res: any) => {
      toggleDialog.value = false;
      exeGetStudents();
   })
   onSuccessGetStudents((res: any) => {
      StudentList.value = res.data
   })
})
const search = ref("")
</script>
