<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
         <div class="_flex _gap-2 _items-center">
            <v-btn color="primary" icon="fa fa-plus" @click="()=>openDialog(null)"></v-btn>
            <p> Teacher List </p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field
           v-model="search" density="compact"
           flat hide-details label="Search" prepend-inner-icon="fa-thin fa-search" single-line variant="solo-filled">
         </v-text-field>
         <v-dialog v-model="toggleDialog" scrollable width="auto">
            <v-card prepend-icon="fa-duotone fa-user-plus" width="600">
               <template v-slot:title>
                  Update in progress
                  {{ dialogEdit ? 'Edit Teacher' : 'New Teacher' }}
               </template>
               <template v-slot:text>
                  <v-form>
                     <div class="_flex _gap-2">
                        <v-text-field v-model="teacherForm.first_name" label="First Name" outlined></v-text-field>
                        <v-text-field v-model="teacherForm.last_name" label="First Name" outlined></v-text-field>
                     </div>
                     <v-text-field v-if="dialogEdit" :value="teacherForm.email" active disabled
                                   label="Email"></v-text-field>
                     <v-text-field v-else v-model="teacherForm.email" label="Email" outlined></v-text-field>
                     <div class="_flex _gap-2">
                        <v-text-field v-model="teacherForm.infos.phone1" label="Phone 1" outlined></v-text-field>
                        <v-text-field v-model="teacherForm.infos.phone2" label="Phone 2" outlined></v-text-field>
                     </div>
                     <div class="_flex _gap-2">
                        <v-text-field v-model="teacherForm.infos.address.street" label="Street" outlined></v-text-field>
                        <v-text-field v-model="teacherForm.infos.address.city" label="City" outlined></v-text-field>
                     </div>
                     <div class="_flex _gap-2">
                        <v-text-field v-model="teacherForm.infos.address.state" label="State" outlined></v-text-field>
                        <v-text-field v-model="teacherForm.infos.address.zip" label="Zip" outlined></v-text-field>
                     </div>
                  </v-form>
               </template>
               <template v-slot:actions>
                  <v-btn class="ms-auto" text="Ok" @click="saveForm"></v-btn>
               </template>
            </v-card>
         </v-dialog>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table v-model:search="search" :headers="headers" :items="TeacherList">
         
         <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
               <template v-for="column in columns" :key="column.key">
                  <td class="_font-black">
                     <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                     <template v-if="isSorted(column)">
                        <v-icon :icon="getSortIcon(column)"></v-icon>
                     </template>
                  </td>
               </template>
            </tr>
         </template>
         <template v-slot:item.name="{ item }">
            <p class="_text-sm">
               {{ item.first_name }} {{ item.last_name }}
            </p>
         </template>
         <template v-slot:item.infos.address="{value }">
            <div class="_text-xs">
               {{ value.street }} {{ value.city }} {{ value.state }} {{ value.zip }}
            </div>
         </template>
         <template v-slot:item.infos="{value }">
            <div class="_flex _flex-col _gap-1 _text-xs">
               <div class="_whitespace-nowrap">{{ value.phone1 }}</div>
               <div class="_whitespace-nowrap">{{ value.phone2 }}</div>
            </div>
         </template>
         <template v-slot:item.created_at="{ value }">
            <div class="_text-xs">
               <v-tooltip location="bottom" activator="parent" :text="moment(value).format('LLL')">
               
               </v-tooltip>
               
               {{ moment(value).format('MMMM Do YYYY') }}
            </div>
         </template>
         <template v-slot:item.actions="{ item }">
            <div class="_flex _gap-3">
               <v-btn color="success" density="compact" icon
                      variant="tonal" @click="openDialog(item)">
                  <v-icon class="fa-duotone fa-edit" size=""></v-icon>
               </v-btn>
               <v-btn color="error" density="compact" icon
                      variant="tonal">
                  <v-icon class="fa-duotone fa-trash" size=""></v-icon>
               
               </v-btn>
               <v-btn color="primary" density="compact" icon :to='{name:"TeacherDetails",params:{teacher_id:item.id}}'
                      variant="tonal">
                  <v-icon class="fa-duotone fa-arrow-up-right-from-square" size=""></v-icon>
               
               </v-btn>
            
            </div>
         </template>
      </v-data-table>
   </v-card>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useTeacher} from "@/api/useTeacher";
import {teacherState} from "@/stats/teacherState";
import moment from "moment";

interface Teacher {
   first_name: string;
   last_name: string;
   email: string;
   infos: {
      address: {
         street: string;
         city: string;
         state: string;
         zip: string;
      };
      phone1: string;
      phone2: string;
   };
   created_at?: string;
   updated_at?: string;
}

const {useGetTeachers, useCreateTeacher, useUpdateTeacher} = useTeacher();
const {
   execute: exeGetTeachers,
   onResultSuccess: onSuccessGetTeachers,
} = useGetTeachers()
const {
   execute: exeCreateTeacher,
   onResultSuccess: onSuccessCreateTeacher,
} = useCreateTeacher()

const {
   execute: exeUpdateTeacher,
   onResultSuccess: onSuccessUpdateTeacher,
} = useUpdateTeacher()
const dialogEdit = ref(false)
const {TeacherList} = teacherState();
const toggleDialog = ref(false)
const selectedTeacher = ref<Teacher>({} as Teacher)
const teacherForm = ref<Teacher>({} as Teacher)


const openDialog = (item: boolean | Teacher = false) => {
   if (item) {
      dialogEdit.value = true;
      // remove created_at and updated_at item
      const {created_at, updated_at, ...rest} = item as Teacher;
      teacherForm.value = rest;
      
      
   } else {
      emptyTeacherForm();
      dialogEdit.value = false;
   }
   toggleDialog.value = true;
}

const saveForm = () => {
   if (dialogEdit.value) {
      exeUpdateTeacher({
         params: teacherForm.value
      })
   } else {
      exeCreateTeacher({
         params: teacherForm.value
      })
   }
}
const headers = [
   // {title: 'ID', key: 'id', filterable: false},
   {title: 'Full Name', key: 'name'},
   {title: 'Email', key: 'email'},
   {title: 'Phones', key: 'infos'},
   {title: 'Address', key: 'infos.address'},
   {title: 'Created At', key: 'created_at'},
   {title: 'Actions', key: 'actions'},
]
exeGetTeachers();
onSuccessGetTeachers((res: any) => {
   TeacherList.value = res.data;
})
onSuccessCreateTeacher((res: any) => {
   exeGetTeachers();
   toggleDialog.value = false
   emptyTeacherForm()
})
onSuccessUpdateTeacher((res: any) => {
   exeGetTeachers();
   toggleDialog.value = false
   emptyTeacherForm()
})
const search = ref("")
const emptyTeacherForm = () => {
   teacherForm.value = {
      first_name: "",
      last_name: "",
      email: "",
      infos: {
         address: {
            street: "",
            city: "",
            state: "",
            zip: "",
         },
         phone1: "",
         phone2: "",
      }
   }
}
</script>
