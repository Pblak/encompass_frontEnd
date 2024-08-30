<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <div class="_flex _gap-2 _items-center">
        <CreatePackageDialog />
        <p>
          Packages List
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" density="compact" flat hide-details label="Search"
                    prepend-inner-icon="fa-thin fa-search" single-line variant="solo-filled">
      </v-text-field>
    </v-card-title>
    <v-divider class="border-opacity-50"></v-divider>
    <v-data-table v-model:search="search" :header-props="{dense: true}" :headers="headers" :items="PackageList">
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
      <template v-slot:item.name="{ value }">
        <div class="_flex _gap-1 _font-bold _capitalize">
         <p> {{ value }}</p>
        </div>
      </template>
      <template v-slot:item.price="{ value }">
        <div class="_flex _gap-1">
          <v-chip  color="primary" class="!_font-bold">{{ toCurrency(value) }}
          </v-chip>
        </div>
      </template>

      <template v-slot:item.created_at="{ value }">
        <p>
          <v-tooltip activator="parent" location="top">{{ moment(value).format('MMMM Do YYYY, h:mm:ss a') }}</v-tooltip>
          {{ moment(value).format('LL') }}
        </p>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="_flex _gap-3 ">
          <v-btn size="30" color="primary" variant="tonal" icon="fa-duotone fa-edit !_text-sm"   @click="editPackage(item)" elevation="0"></v-btn>
<!--          <v-btn size="small" icon="fa-thin fa-calendar _text-sm" elevation="0"></v-btn>-->
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {exeGlobalGetPackages} from "@/api/usePackage";
import {packageState, PackageType} from "@/stats/packageState";
import CreatePackageDialog from "@/views/dashboard/package/packageDialog/CreatePackageDialog.vue";
import moment from "moment/moment";
import {toCurrency} from "@/stats/Utils";

const APP_URL = import.meta.env.VITE_APP_URL;
const {PackageList, selectedPackage, packageDialog} = packageState();
const createPackage = ref(true)
const search = ref("")
const headers =[
  {text: 'Name', key: 'name'},
  {text: 'Price', key: 'price'},
  {text: 'Description', key: 'description'},
  {text: 'Created At', key: 'created_at'},
  {text: 'Actions', key: 'actions', sortable: false},
]
const editPackage = (item: PackageType) => {
  packageDialog.value = true;
  selectedPackage.value = item;
  if(!selectedPackage.value.plans) selectedPackage.value.plans = []
  createPackage.value = false;
}
onMounted(() => {
  exeGlobalGetPackages()
})

</script>
