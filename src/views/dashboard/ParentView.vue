<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <div class="_flex _gap-2 _items-center">
        <CreateParentDialog/>
        <p>
          Parent List
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                    variant="solo-filled" flat hide-details single-line>
      </v-text-field>
    </v-card-title>
    <v-divider class="border-opacity-50"></v-divider>

    <v-data-table :headers="headers" :header-props="{dense: true}" v-model:search="search" :items="ParentList">
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

      <!--   body   -->

      <template v-slot:item.infos="{value }">
        <div class="_flex _flex-col _gap-1 _text-xs" v-if="value">
          <div class="_whitespace-nowrap">{{ value.phone1 }}</div>
          <div class="_whitespace-nowrap">{{ value.phone2 }}</div>
        </div>
      </template>
      <template v-slot:item.infos.address="{ item }">
        {{ item.infos.address.street }}, {{ item.infos.address.city }}, {{ item.infos.address.state }},
        {{ item.infos.address.zip }}
      </template>
      <template v-slot:item.created_at="{ value }">
        <p>
          <v-tooltip activator="parent" location="top">{{ moment(value).format('MMMM Do YYYY, h:mm:ss a') }}</v-tooltip>
          {{ moment(value).format('LLL') }}
        </p>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="_flex _gap-3 ">
          <v-btn size="small" icon="fa-thin fa-edit _text-sm" elevation="0"></v-btn>
          <v-btn size="small" icon="fa-thin fa-calendar _text-sm" elevation="0"></v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useParent, exeGlobalGetParents} from "@/api/useParent";
import CreateParentDialog from "@/views/dashboard/parent/createParent/CreateParentDialog.vue";
import moment from "moment";
import {parentState} from "@/stats/parentState";

const search = ref("")
const {ParentList} = parentState();
const headers = [
  {text: 'id', align: 'start', sortable: false, key: 'id',},
  {text: 'Name', key: 'name'},
  {text: 'Email', key: 'email'},
  {text: 'Phones', key: 'infos'},
  {text: 'Address', key: 'infos.address'},
  {text: 'Created At', key: 'created_at'},
  {text: 'Actions', key: 'actions', sortable: false},
]
onMounted(async () => {
  await exeGlobalGetParents();
})
</script>
