<template>
    <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
        <div class="_flex _flex-col _gap-4">
            <div class="_flex _justify-center">
                <v-avatar size="170">
                    <v-img alt="John" :src="imageAvatar" ></v-img>
                </v-avatar>
            </div>
            <v-file-input v-model="parentForm.infos.avatar as File"
                          density="comfortable"
                          label="Select your image"
                          placeholder="Select your image"
                          prepend-icon="" show-size
                          variant="solo" >
                <template v-slot:selection="{ fileNames }">
                    <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip class="me-2" color="primary" label size="small">
                            {{ fileName }}
                        </v-chip>
                    </template>
                </template>
            </v-file-input>
        </div>
        <div class="_flex _flex-wrap _gap-4">
            <v-text-field v-model="parentForm.first_name" :rules="$rules('required', 'First Name')"
                          density="comfortable" label="First Name" class="!_flex-1" variant="solo"
            ></v-text-field>

            <v-text-field v-model="parentForm.last_name" :rules="$rules('required', 'Last Name')"
                          density="comfortable" label="Last Name" class="!_flex-1" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="parentForm.email" :rules="$rules('required|email', 'Email')"
                          class="!_flex-1" disabled variant="solo"
                          density="comfortable" label="Email"></v-text-field>

<!--            <v-text-field v-model="parentForm.password" :rules="$rules('required|min:6', 'Password')"-->
<!--                          class="!_flex-1"-->
<!--                          density="comfortable"-->
<!--                          label="Password" type="password"-->
<!--            ></v-text-field>-->
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="parentForm.infos.phone1" :rules="$rules('required|phone', 'Phone')"
                          class="!_flex-1" density="comfortable" variant="solo" label="Phone"></v-text-field>

            <v-text-field v-model="parentForm.infos.address.street" :rules="$rules('required', 'Street')"
                          class="!_flex-1" density="comfortable" variant="solo" label="Street"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="parentForm.infos.address.city" variant="solo" :rules="$rules('required', 'City')"
                          class="!_flex-1" density="comfortable"
                          label="City"
                          required></v-text-field>

            <v-text-field v-model="parentForm.infos.address.zip" variant="solo" :rules="$rules('required', 'Zip')"
                          class="!_flex-1" density="comfortable" label="Zip"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-select v-model="parentForm.infos.gender" variant="solo" :items="['male','female']"
                      :rules="[v =>!!v||'Gender is required']"
                      class="!_flex-1" density="comfortable"
                      hide-details
                      label="Gender"></v-select>
            <v-text-field v-model="parentForm.infos.allergies" variant="solo" class="!_flex-1"
                          density="comfortable"
                          hide-details label="Allergies"></v-text-field>
        </div>
    </v-form>
</template>
<script lang="ts" setup>
import type {ParentType} from "@/stats/parentState";
import {onMounted, ref} from "vue";
import {useEventBus} from "@vueuse/core";


type PushDataType = (data: { validate: boolean, data: ParentType }) => void;
const props = defineProps<{
    eventForValidate: string,
    parentSelected: ParentType,
    pushData: PushDataType;
}>();

const {on} = useEventBus(props.eventForValidate as unknown as string);
const parentForm = props.parentSelected
const APP_URL = import.meta.env.VITE_APP_URL;
const ElForm = ref<any>(null);
const imageAvatar:string = APP_URL+parentForm.infos.avatar
const validateForm = async () => {
    const {valid} = await ElForm.value.validate()
    console.log(parentForm)
    if(!valid) return;
    props.pushData({
        validate: valid,
        data: {
            id: parentForm.id,
            first_name: parentForm.first_name,
            last_name: parentForm.last_name,
            email: parentForm.email,
            infos: parentForm.infos,
            // avatar: parentForm.infos.avatar
        }
    });

};
onMounted(() => {
    on(() => {
        validateForm();
    });
})
</script>
