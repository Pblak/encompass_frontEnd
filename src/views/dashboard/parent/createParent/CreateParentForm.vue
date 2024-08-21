<template>
  <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
    <div class="_flex _flex-wrap _gap-4">
      <v-text-field v-model="parentForm.first_name" :rules="$rules('required', 'First Name')"
                    density="comfortable" label="First Name" class="!_flex-1"
      ></v-text-field>

      <v-text-field v-model="parentForm.last_name" :rules="$rules('required', 'Last Name')"
                    density="comfortable" label="Last Name" class="!_flex-1"
      ></v-text-field>
    </div>
    <div class="_flex _flex-wrap _gap-4">

      <v-text-field v-model="parentForm.email" :rules="$rules('required|email', 'Email')"
                    class="!_flex-1"
                    density="comfortable" label="Email"></v-text-field>

      <v-text-field v-model="parentForm.password" :rules="$rules('required|min:6', 'Password')"
                    class="!_flex-1"
                    density="comfortable"
                    label="Password" type="password"
      ></v-text-field>
    </div>
    <div class="_flex _flex-wrap _gap-4">

      <v-text-field v-model="parentForm.infos.phone1" :rules="$rules('required|phone', 'Phone')"
                    class="!_flex-1" density="comfortable" label="Phone"></v-text-field>

      <v-text-field v-model="parentForm.infos.address.street" :rules="$rules('required', 'Street')"
                    class="!_flex-1" density="comfortable" label="Street"
      ></v-text-field>
    </div>
    <div class="_flex _flex-wrap _gap-4">

      <v-text-field v-model="parentForm.infos.address.city" :rules="$rules('required', 'City')"
                    class="!_flex-1" density="comfortable"
                    label="City"
                    required></v-text-field>

      <v-text-field v-model="parentForm.infos.address.zip" :rules="$rules('required', 'Zip')"
                    class="!_flex-1" density="comfortable" label="Zip"
      ></v-text-field>
    </div>
    <div class="_flex _flex-wrap _gap-4">

      <v-select v-model="parentForm.infos.gender" :items="['male','female']"
                :rules="[v =>!!v||'Gender is required']"
                class="!_flex-1" density="comfortable"
                hide-details
                label="Gender"></v-select>
      <v-text-field v-model="parentForm.infos.allergies" class="!_flex-1"
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
  eventForValidate: {
    type: string;
    required: true;
  },
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const parentForm = ref<ParentType>({
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  parent_id: 0,
  infos: {
    phone1: "",
    address: {
      street: "",
      city: "",
      zip: "",
      state: "",
    },
    gender: "male",
  }
})

const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid,
    data: {...parentForm.value}
  });

};
onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
