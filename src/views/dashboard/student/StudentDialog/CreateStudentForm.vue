<script lang="ts" setup>
import type {StudentType} from "@/stats/studentState";
import {onMounted, ref} from "vue";
import {parentState} from "@/stats/parentState";
import {useEventBus} from "@vueuse/core";
import {loginState} from "@/stats/loginState";
import {isRole} from "@/stats/Utils";


type PushDataType = (data: { validate: boolean, data: StudentType }) => void;
const props = defineProps<{
    eventForValidate: string,
    pushData: PushDataType;
}>();
const {userLogin} = loginState()
const {on} = useEventBus(props.eventForValidate as unknown as string);
const {ParentList} = parentState();
const studentForm = ref({
    id: null,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    parent_id: 0,
    password: "",
    infos: {
        username: "",
        phone1: "",
        address: {
            street: "",
            city: "",
            zip: "",
            state: "",
        },
        gender: "male" as "male" | "female",
    },
} as StudentType)


const ElForm = ref<any>(null);
const validateForm = async () => {
    const {valid} = await ElForm.value.validate()
    console.log('aeaze', valid)
    if(!valid) return;
    props.pushData({
        validate: valid,
        data: {...studentForm.value}
    });

};
onMounted(() => {
    on(() => {
        console.log('aeaze')
        validateForm();
    });
})
</script>
<template>
    <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
        <div class="_flex _flex-wrap _gap-4">
            <v-text-field v-model="studentForm.first_name"
                          :rules="$rules('required', 'First Name')"
                          density="comfortable" label="First Name" class="!_flex-1" variant="solo"
            ></v-text-field>

            <v-text-field v-model="studentForm.last_name"
                          :rules="$rules('required', 'Last Name')"
                          density="comfortable" label="Last Name" class="!_flex-1" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">
            <v-text-field v-model="studentForm.username"
                          class="!_flex-1"
                          :rules="$rules('required', 'username')"
                          density="comfortable" label="Username" variant="solo"></v-text-field>
        </div>

        <v-select v-model="studentForm.parent_id" v-if="isRole('admin')"
                  :items="ParentList.map((item: any) => {return {name:item.name, id:item.id}})"
                  :rules="$rules('required', 'Parent')"
                  chips variant="solo"
                  clearable density="comfortable" class="!_flex-1" item-title="name" item-value="id"
                  label="Parent">
        </v-select>

        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="studentForm.email"
                          :rules="$rules('email', 'Email')"
                          class="!_flex-1"
                          density="comfortable" label="Email" variant="solo"></v-text-field>

            <v-text-field v-model="studentForm.password"
                          :rules="$rules('required|min:6', 'Password')"
                          class="!_flex-1"
                          density="comfortable"
                          label="Password" type="password" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="studentForm.infos.phone1"
                          :rules="$rules('required|phone', 'Phone')"
                          class="!_flex-1" density="comfortable" label="Phone" variant="solo"></v-text-field>

            <v-text-field v-model="studentForm.infos.address.street"
                          :rules="$rules('required', 'Street')"
                          class="!_flex-1" density="comfortable" label="Street" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="studentForm.infos.address.city"
                          :rules="$rules('required', 'City')"
                          class="!_flex-1" density="comfortable"
                          label="City" variant="solo"
                          required></v-text-field>

            <v-text-field v-model="studentForm.infos.address.zip"
                          :rules="$rules('required', 'Zip')"
                          class="!_flex-1" density="comfortable" label="Zip" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-select v-model="studentForm.infos.gender" :items="['male','female']"

                      class="!_flex-1" density="comfortable" variant="solo"
                      hide-details
                      label="Gender"></v-select>
            <v-text-field v-model="studentForm.infos.allergies" class="!_flex-1"
                          density="comfortable" variant="solo"
                          hide-details label="Allergies"></v-text-field>
        </div>
    </v-form>
</template>
