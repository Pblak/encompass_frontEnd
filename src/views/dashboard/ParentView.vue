<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <div class="_flex _gap-2 _items-center">
        <v-tooltip text="Tooltip" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa fa-plus" @click="toggleDialog = true"> </v-btn>
          </template>
        </v-tooltip>

        <p>
          Parent List
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="fa-thin fa-search"
                    variant="solo-filled" flat hide-details single-line>
      </v-text-field>
      <v-dialog v-model="toggleDialog" width="auto">
        <v-card width="600" prepend-icon="fa-duotone fa-user-plus">
          <template v-slot:title>
            Update in progress
          </template>
          <template v-slot:text>
            <v-form>

            </v-form>
          </template>
          <template v-slot:actions>
            <v-btn class="ms-auto" text="Ok" @click="toggleDialog = false"></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table :headers="headers" item-value="name"  v-model:search="search" :items="ParentList">
      <template v-slot:item.actions="{ item }">
        <div class="_flex _gap-3 ">
          <v-btn size="small" icon="fa-thin fa-edit _text-sm" elevation="0"> </v-btn>
          <v-btn size="small" icon="fa-thin fa-calendar _text-sm" elevation="0"> </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useParent} from "@/api/useParent";
import moment from "moment";
import {parentState} from "@/stats/parentState";

const {useGetParents} = useParent();
const {ParentList } = parentState();
const toggleDialog = ref(false)
const headers = [
  {title: 'id', align: 'start', sortable: false, key: 'id',},
  {title: 'Name', key: 'name'},
  {title: 'Email', key: 'email'},
  {title: 'Phone', key: 'phone'},
  {title: 'Address', key: 'address'},
  {title: 'Created At', key: 'created_at'},
  {title: 'Actions', key: 'actions', sortable: false},
]
useGetParents().execute();
useGetParents().onResultSuccess((data) => {
  ParentList.value = data.map((item: any) => {
    return {
      id: item.id,
      name: item.name ? item.name : item.first_name + " " + item.last_name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      created_at: moment(item.created_at).format("YYYY-MM-DD"),
    }
  });
})
const search = ref("")
</script>
