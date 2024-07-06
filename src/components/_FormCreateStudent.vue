<script lang="ts" setup>
import type {StudentType} from "@/stats/studentState";
import {onMounted, ref} from "vue";
import {parentState} from "@/stats/parentState";
import {useStudent} from "@/api/useStudent";
import {useEventBus} from "@vueuse/core";

const props = defineProps<{
   eventForValidate: {
      type: string;
      required: true;
   },
   pushData: {
      type: (data: {validate: boolean, data: StudentType}) => void;
      required: true;
   }
}>();
const {on} = useEventBus(props.eventForValidate);
const {useCreateStudent , useGetStudents} = useStudent();
const {ParentList} = parentState();
const studentForm = ref<StudentType>({
   first_name: "",
   last_name: "",
   email: "",
   password: "",
   parent_id: Number,
   infos: {
      phone: "",
      address: {
         street: "",
         city: "",
         zip: "",
      },
      gender: "male",
   },
})

const ElForm = ref<any>(null);

const nameRules = [
   v => !!v || 'Name is required',
];
const emailRules = [
   v => !!v || 'E-mail is required',
   v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
];

const passwordRules = [
   v => !!v || 'Password is required',
   v => (v && v.length >= 6) || 'Password must be at least 6 characters',
];

const phoneRules = [
   v => !!v || 'Phone is required',
  // validate phone number 534-409-3745
   v => /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(v) || 'Phone number must be valid',
];

const addressRules = [
   v => !!v || 'Address is required',
];

const zipRules = [
   v => !!v || 'Zip is required',
   v => /^[0-9]{5}(?:-[0-9]{4})?$/.test(v) || 'Zip code must be valid',
];

const validateForm = async () => { 
   const {valid} = await ElForm.value.validate()
   if (!valid) return;
   props.pushData({
      validate: valid,
      data: {...studentForm.value}
   });
   
};
onMounted(() => {
   on(() => {
      validateForm();
   });
})
</script>
<template>
   <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
      <div class="_flex _flex-wrap _gap-4">
         <v-text-field v-model="studentForm.first_name" :rules="nameRules"
                       density="comfortable" label="First Name" class="!_flex-1"
         ></v-text-field>
         
         <v-text-field v-model="studentForm.last_name" :rules="nameRules"
                       density="comfortable" label="Last Name" class="!_flex-1"
         ></v-text-field>
      </div>
      <v-select v-model="studentForm.parent_id"
                :items="ParentList.map((item: any) => {return {name:item.name, id:item.id}})"
                :rules="[v => !!v || 'Parent is required']" chips
                clearable density="comfortable" class="!_flex-1" item-title="name" item-value="id"
                label="User">
      </v-select>
      
      <div class="_flex _flex-wrap _gap-4">
         
         <v-text-field v-model="studentForm.email" :rules="emailRules" class="!_flex-1"
                       density="comfortable" label="Email"></v-text-field>
         
         <v-text-field v-model="studentForm.password" :rules="passwordRules" class="!_flex-1"
                       density="comfortable"
                       label="Password" type="password"
         ></v-text-field>
      </div>
      <div class="_flex _flex-wrap _gap-4">
         
         <v-text-field v-model="studentForm.infos.phone" :rules="phoneRules"
                       class="!_flex-1" density="comfortable" label="Phone"></v-text-field>
         
         <v-text-field v-model="studentForm.infos.address.street" :rules="addressRules"
                       class="!_flex-1" density="comfortable" label="Street"
         ></v-text-field>
      </div>
      <div class="_flex _flex-wrap _gap-4">
         
         <v-text-field v-model="studentForm.infos.address.city" :rules="addressRules"
                       class="!_flex-1" density="comfortable"
                       label="City"
                       required></v-text-field>
         
         <v-text-field v-model="studentForm.infos.address.zip" :rules="zipRules"
                       class="!_flex-1" density="comfortable" label="Zip"
         ></v-text-field>
      </div>
      <div class="_flex _flex-wrap _gap-4">
         
         <v-select v-model="studentForm.infos.gender" :items="['male','female']"
                   :rules="[v =>!!v||'Gender is required']"
                   class="!_flex-1" density="comfortable"
                   hide-details
                   label="Gender"></v-select>
         <v-text-field v-model="studentForm.infos.allergies" class="!_flex-1"
                       density="comfortable"
                       hide-details label="Allergies"></v-text-field>
      </div>
   </v-form>
</template>