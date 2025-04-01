<script lang="ts" setup>
import type {TeacherType} from "@/stats/teacherState";
import {onMounted, ref} from "vue";
import {useEventBus} from "@vueuse/core";

type PushDataType = (data: { validate: boolean, data: TeacherType }) => void;


const props = defineProps<{
    selectedTeacher: TeacherType
    eventForValidate: string,
    pushData: PushDataType;
}>();

const {on} = useEventBus(props.eventForValidate as unknown as string);
// const {ParentList} = parentState();
const APP_URL = import.meta.env.VITE_APP_URL;
const teacherForm = props.selectedTeacher;
const imageAvatar: string = APP_URL + teacherForm.infos.avatar
const ElForm = ref<any>(null);
const validateForm = async () => {
    const {valid} = await ElForm.value.validate()
    console.log(teacherForm)
    if(!valid) return;
    props.pushData({
        validate: valid,
        data: {
            ...teacherForm,
        }
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
        <div class="_flex _flex-col _gap-4">
            <div class="_flex _justify-center">
                <v-avatar size="170">
                    <v-img alt="John" :src="imageAvatar"></v-img>
                </v-avatar>
            </div>
            <v-file-input v-model="teacherForm.infos.avatar as File"
                          density="comfortable"
                          label="Select your image"
                          placeholder="Select your image"
                          prepend-icon="" show-size
                          variant="solo">
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
            <v-text-field v-model="teacherForm.first_name"
                          :rules="$rules('required', 'First Name')"
                          density="comfortable" label="First Name" class="!_flex-1" variant="solo"
            ></v-text-field>

            <v-text-field v-model="teacherForm.last_name"
                          :rules="$rules('required', 'Last Name')"
                          density="comfortable" label="Last Name" class="!_flex-1" variant="solo"
            ></v-text-field>
        </div>
<!--        <div class="_flex _flex-wrap _gap-4">-->
<!--            <v-text-field v-model="teacherForm.infos.username"-->
<!--                          class="!_flex-1"-->
<!--                          :rules="$rules('required', 'username')"-->
<!--                          density="comfortable" label="Username" variant="solo"></v-text-field>-->
<!--        </div>-->
        <!--        <v-select v-model="teacherForm.parent_id" v-if="isRole('admin')"-->
        <!--                  :items="ParentList.map((item: any) => {return {name:item.name, id:item.id}})"-->
        <!--                  :rules="$rules('required', 'Parent')"-->
        <!--                  chips variant="solo"-->
        <!--                  clearable density="comfortable" class="!_flex-1" item-title="name" item-value="id"-->
        <!--                  label="Parent">-->
        <!--        </v-select>-->

        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="teacherForm.email"
                          :rules="$rules('email', 'Email')"
                          class="!_flex-1"
                          density="comfortable" label="Email" variant="solo"></v-text-field>

            <!--            <v-text-field v-model="teacherForm.password"-->
            <!--                          :rules="$rules('required|min:6', 'Password')"-->
            <!--                          class="!_flex-1"-->
            <!--                          density="comfortable"-->
            <!--                          label="Password" type="password" variant="solo"-->
            <!--            ></v-text-field>-->
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="teacherForm.infos.phone1"
                          :rules="$rules('required|phone', 'Phone')"
                          class="!_flex-1" density="comfortable" label="Phone" variant="solo"></v-text-field>

            <v-text-field v-model="teacherForm.infos.address.street"
                          :rules="$rules('required', 'Street')"
                          class="!_flex-1" density="comfortable" label="Street" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-text-field v-model="teacherForm.infos.address.city"
                          :rules="$rules('required', 'City')"
                          class="!_flex-1" density="comfortable"
                          label="City" variant="solo"
                          required></v-text-field>

            <v-text-field v-model="teacherForm.infos.address.zip"
                          :rules="$rules('required', 'Zip')"
                          class="!_flex-1" density="comfortable" label="Zip" variant="solo"
            ></v-text-field>
        </div>
        <div class="_flex _flex-wrap _gap-4">

            <v-select v-model="teacherForm.infos.gender" :items="['male','female']"

                      class="!_flex-1" density="comfortable" variant="solo"
                      hide-details
                      label="Gender"></v-select>
            <v-text-field v-model="teacherForm.infos.allergies" class="!_flex-1"
                          density="comfortable" variant="solo"
                          hide-details label="Allergies"></v-text-field>
        </div>
    </v-form>
</template>
