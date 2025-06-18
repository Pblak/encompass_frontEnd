<template>
    <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
        <div class="_flex _flex-col _gap-4">
            <div class="_flex _justify-center">
                <v-avatar size="170">
                    <v-img alt="Parent Avatar" :src="imageAvatar" v-if="imageAvatar"></v-img>
                    <v-icon v-else size="80">fa-user</v-icon>
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
import {onMounted, ref, computed, watch, watchEffect} from "vue";
import {useEventBus} from "@vueuse/core";


type PushDataType = (data: { validate: boolean, data: ParentType }) => void;
const props = defineProps<{
    eventForValidate: string,
    parentSelected: ParentType,
    pushData: PushDataType;
}>();

console.log('UpdateParentForm props:', props);
console.log('parentSelected:', props.parentSelected);

const {on} = useEventBus(props.eventForValidate as unknown as string);

// Initialize with safe defaults
const parentForm = ref({
    id: props.parentSelected?.id || '',
    first_name: props.parentSelected?.first_name || '',
    last_name: props.parentSelected?.last_name || '',
    email: props.parentSelected?.email || '',
    infos: {
        gender: props.parentSelected?.infos?.gender || '',
        allergies: props.parentSelected?.infos?.allergies || '',
        phone1: props.parentSelected?.infos?.phone1 || '',
        phone2: props.parentSelected?.infos?.phone2 || '',
        avatar: props.parentSelected?.infos?.avatar || '',
        address: props.parentSelected?.infos?.address || {
            street: '',
            city: '',
            state: '',
            zip: ''
        }
    }
});

// Watch for prop changes
watchEffect(() => {
    if (props.parentSelected) {
        parentForm.value = {
            id: props.parentSelected.id || '',
            first_name: props.parentSelected.first_name || '',
            last_name: props.parentSelected.last_name || '',
            email: props.parentSelected.email || '',
            infos: {
                gender: props.parentSelected.infos?.gender || '',
                allergies: props.parentSelected.infos?.allergies || '',
                phone1: props.parentSelected.infos?.phone1 || '',
                phone2: props.parentSelected.infos?.phone2 || '',
                avatar: props.parentSelected.infos?.avatar || '',
                address: props.parentSelected.infos?.address || {
                    street: '',
                    city: '',
                    state: '',
                    zip: ''
                }
            }
        };
    }
});
const APP_URL = import.meta.env.VITE_APP_URL;
const ElForm = ref<any>(null);
const selectedFile = ref<File | null>(null);
const imageAvatar = computed(() => {
    if (selectedFile.value) {
        return URL.createObjectURL(selectedFile.value);
    }
    return parentForm.value.infos?.avatar ? APP_URL + parentForm.value.infos.avatar : '';
});

watch(() => parentForm.value.infos.avatar, (newAvatar) => {
    if (newAvatar instanceof File) {
        selectedFile.value = newAvatar;
    }
});
const validateForm = async () => {
    const {valid} = await ElForm.value.validate()
    console.log(parentForm.value)
    if(!valid) return;
    
    const formData = new FormData();
    formData.append('id', parentForm.value.id.toString());
    formData.append('first_name', parentForm.value.first_name);
    formData.append('last_name', parentForm.value.last_name);
    formData.append('email', parentForm.value.email);
    
    // Handle infos as JSON or individual fields
    formData.append('infos[phone1]', parentForm.value.infos.phone1 || '');
    formData.append('infos[phone2]', parentForm.value.infos.phone2 || '');
    formData.append('infos[gender]', parentForm.value.infos.gender || '');
    formData.append('infos[allergies]', parentForm.value.infos.allergies || '');
    formData.append('infos[address][street]', parentForm.value.infos.address.street || '');
    formData.append('infos[address][city]', parentForm.value.infos.address.city || '');
    formData.append('infos[address][state]', parentForm.value.infos.address.state || '');
    formData.append('infos[address][zip]', parentForm.value.infos.address.zip || '');
    
    if (selectedFile.value) {
        formData.append('avatar', selectedFile.value);
    }
    
    props.pushData({
        validate: valid,
        data: formData
    });
};
onMounted(() => {
    on(() => {
        validateForm();
    });
})
</script>
