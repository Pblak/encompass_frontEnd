<template>
  <v-data-table v-model:search="search" :header-props="{dense: true}" :headers="headers" :items="TeacherList">
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
    <template v-slot:item.infos.avatar="{item, value }">
      <v-avatar size="40" color="warning">
        <v-img v-if="value" :src="APP_URL+value" alt="avatar"></v-img>
        <span v-else class="_text-xl _flex _items-center _justify-center _bg-primary">
          {{item.name.slice(0,2).toUpperCase()}}
        </span>
      </v-avatar>
    </template>
    <template #item.created_at="{ value }">
      <p>
        <v-tooltip activator="parent" location="top">{{
            moment(value).format('MMMM Do YYYY, h:mm:ss a')
          }}
        </v-tooltip>
        {{ moment(value).format('LLL') }}
      </p>
    </template>
    <template #item.infos="{value }">
      <div class="_flex _flex-col _gap-1 _text-xs">
        <div class="_whitespace-nowrap">{{ value.phone1 }}</div>
        <div class="_whitespace-nowrap">{{ value.phone2 }}</div>
      </div>
    </template>
    <template #item.infos.address="{ item }">
      {{ item.infos.address.street }}, {{ item.infos.address.city }}, {{ item.infos.address.state }},
      {{ item.infos.address.zip }}
    </template>
    <template #item.actions="{item}">
      <div class="_flex _gap-3">
        <v-btn color="primary" size="small" icon="fa-thin fa-arrow-up-right-from-square"
               :to='{name:"TeacherDetails",params:{teacher_id:item.id}}' variant="tonal">
        </v-btn>

        <v-btn color="red" icon="fa-thin fa-trash" v-if="!item.deleted_at" size="small"
               variant="tonal" @click="openDeleteDialog(item)">
        </v-btn>
      </div>
    </template>

  </v-data-table>
  <v-dialog v-model="toggleDeleteDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-guitar">
      <template v-slot:title>
        Delete Lesson
      </template>
      <template v-slot:text>
        <v-alert type="error" variant="tonal">
          Are you sure you want to delete this teacher {{ selectedDeleteTeacher.name }}} ?
        </v-alert>
      </template>
      <template v-slot:actions>
        <v-btn color="success" @click="deleteTeacher" variant="tonal">
          confirm
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

</template>
<script setup lang="ts">
import moment from "moment/moment";
import {teacherState, TeacherType} from "@/stats/teacherState";
import {exeGlobalGetTeachers, useTeacher} from "@/api/useTeacher";
import {ref} from "vue";


const {TeacherList, withTrashTeacher} = teacherState();
const toggleDeleteDialog = ref(false)
const selectedDeleteTeacher = ref<TeacherType>()
const {useDeleteTeacher} = useTeacher()
const search = ref("")
const APP_URL = import.meta.env.VITE_APP_URL;
const {
  execute: exeDeleteTeacher,
  onResultSuccess: onResultSuccessDeleteTeacher
} = useDeleteTeacher()
const headers = [
  // {text: 'ID', key: 'id'},
  {text: '', key: 'infos.avatar'},
  {text: 'Full Name', key: 'name'},
  {text: 'Email', key: 'email'},
  {text: 'Phones', key: 'infos'},
  {text: 'Parent', key: 'parent.name'},
  {text: 'Address', key: 'infos.address'},
  {text: 'Created At', key: 'created_at'},
  {text: 'actions', key: 'actions'}
];
const openDeleteDialog = (teacher: TeacherType) => {
  toggleDeleteDialog.value = true;
  selectedDeleteTeacher.value = teacher;
}
const deleteTeacher = async () => {
  await exeDeleteTeacher({
        data: {
          id: selectedDeleteTeacher.value?.id
        }
      }
  );
}
onResultSuccessDeleteTeacher(() => {
  toggleDeleteDialog.value = false;
  selectedDeleteTeacher.value = {};
  exeGlobalGetTeachers();
})
</script>
