<template>
  <v-form ref="ElForm" v-if="selectedPackage">
    <!--      <v-img v-if="selectedPackage.image &&-->
    <!--                           selectedPackage.image !== 'undefined' && selectedPackage.image !== 'null'"-->
    <!--             :src="APP_URL+selectedPackage.image" contain height="200px">-->
    <!--      </v-img>-->
    <v-text-field v-model="selectedPackage.name" label="Name" density="comfortable"
                  :rules="$rules('required', 'Name')" variant="solo"></v-text-field>
    <v-text-field v-model="selectedPackage.price" label="Price" density="comfortable" type="number"
                  :rules="$rules('required|number|min:1', 'Price')" variant="solo"></v-text-field>
    <v-text-field v-model="selectedPackage.duration" label="Duration" density="comfortable" type="number"
                  :rules="$rules('required|number|min:1', 'Duration')" variant="solo"></v-text-field>
    <v-textarea v-model="selectedPackage.description" label="Description"
                :rules="$rules('max:300', 'Description')" variant="solo"></v-textarea>
  </v-form>
</template>
<script lang="ts" setup>
import type {PackageType} from "@/stats/packageState";
import {onMounted, ref} from "vue";
import {packageState} from "@/stats/packageState";
import {useEventBus} from "@vueuse/core";

type PushDataType = (data: { validate: boolean, data: PackageType }) => void;
const props = defineProps<{
  eventForValidate: string,
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const {selectedPackage} = packageState();
const PackageForm = ref<PackageType>(selectedPackage.value!)
const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid,
    data: {...PackageForm.value}
  });

};
onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
