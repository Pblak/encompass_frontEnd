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
      <v-dialog v-model="toggleDialog" width="auto" >
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
    <v-data-table v-model:search="search" :items="TeacherList"></v-data-table>
  </v-card>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useTeacher} from "@/api/useTeacher";
import {teacherState} from "@/stats/teacherState";
import moment from "moment";

const {useGetTeachers} = useTeacher();
const {TeacherList} = teacherState();
const toggleDialog = ref(false)

useGetTeachers().execute();
useGetTeachers().onResultSuccess((data) => {
  console.log(data)
  TeacherList.value = data.map((item: any) => {
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
const items = ref([
  {
    name: 'Nebula GTX 3080',
    image: '1.png',
    price: 699.99,
    rating: 5,
    stock: true,
  },
  {
    name: 'Galaxy RTX 3080',
    image: '2.png',
    price: 799.99,
    rating: 4,
    stock: false,
  },
  {
    name: 'Orion RX 6800 XT',
    image: '3.png',
    price: 649.99,
    rating: 3,
    stock: true,
  },
  {
    name: 'Vortex RTX 3090',
    image: '4.png',
    price: 1499.99,
    rating: 4,
    stock: true,
  },
  {
    name: 'Cosmos GTX 1660 Super',
    image: '5.png',
    price: 299.99,
    rating: 4,
    stock: false,
  },
])
</script>
