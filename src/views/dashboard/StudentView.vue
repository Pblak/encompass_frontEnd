<template>
   <v-card flat>
      <v-card-title class="d-flex align-center pe-2" >
         <div class="_flex _gap-2 _items-center">
            <v-btn icon="fa fa-plus" @click="toggleDialog = true"> </v-btn>
            <p>Find a Graphics Card</p>
         </div>
         <v-spacer></v-spacer>
         <v-text-field
           v-model="search"
           density="compact"
           label="Search"
           prepend-inner-icon="fa-thin fa-search"
           variant="solo-filled"
           flat
           hide-details
           single-line >
         </v-text-field>
         <v-dialog v-model="toggleDialog" width="auto">
            <v-card width="600" prepend-icon="fa-duotone fa-user-plus">
               <template v-slot:title>
                  Update in progress
               </template>
               <template v-slot:text>
                  <v-form >
                     <v-text-field label="Name" v-model="name" outlined></v-text-field>
                     <v-text-field label="Email" v-model="email" outlined></v-text-field>
                     <v-text-field label="Phone" v-model="phone" outlined></v-text-field>
                     <v-text-field label="Address" v-model="address" outlined></v-text-field>
                  </v-form>
               </template>
               <template v-slot:actions>
                  <v-btn
                    class="ms-auto"
                    text="Ok"
                    @click="toggleDialog = false"
                  ></v-btn>
               </template>
            </v-card>
         </v-dialog>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table v-model:search="search" :items="StudentList"></v-data-table>
   </v-card>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useStudent} from "@/api/useStudent";

import moment from "moment";
import {studentState} from "@/stats/studentState";

const {useGetStudents} = useStudent();
const {StudentList} = studentState();
const toggleDialog = ref(false)

useGetStudents().execute();
useGetStudents().onResultSuccess((data) => {
   StudentList.value = data.map((item: any) => {
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
