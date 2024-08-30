<template>
  <v-form ref="ElForm" @submit.prevent="validateForm">
    <v-text-field v-model="PackageForm.name" :rules="$rules('required', 'Name')"
                  density="comfortable" label="Name" variant="solo"></v-text-field>
    <v-text-field v-model="PackageForm.price" :rules="$rules('required|number|min:1', 'Price')"
                  density="comfortable" label="Price" variant="solo"></v-text-field>

      <v-text-field v-model="PackageForm.duration" :rules="$rules('required|number|min:1', 'Duration')"
                    density="comfortable" label="Duration" variant="solo"></v-text-field>
    <v-textarea v-model="PackageForm.description" variant="solo" :rules="$rules('max:300', 'Description')"/>
  </v-form>
</template>
<script lang="ts" setup>
import type {PackageType} from "@/stats/packageState";
import {onMounted, ref} from "vue";
import {useEventBus} from "@vueuse/core";

type PushDataType = (data: { validate: boolean, data: PackageType }) => void;
const props = defineProps<{
  eventForValidate: string, pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);

const PackageForm = ref<PackageType>({
  name: "",
  price: "0",
  description: "",
})

const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid, data: {...PackageForm.value}
  });

};
onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
