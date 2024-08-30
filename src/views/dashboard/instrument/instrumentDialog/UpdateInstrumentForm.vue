<template>
  <v-form ref="ElForm" v-if="selectedInstrument">
    <v-img v-if="selectedInstrument.image &&
                           selectedInstrument.image !== 'undefined' && selectedInstrument.image !== 'null'"
           :src="APP_URL+selectedInstrument.image" contain height="200px">
    </v-img>
    <v-text-field v-model="selectedInstrument.name" label="Name" density="comfortable"
                  variant="solo"></v-text-field>

    <v-file-input
        v-model="selectedInstrument.newImage as File"
        label="Select your image"
        placeholder="Select your image"
        prepend-icon="" variant="solo" density="comfortable"
        show-size>
      <template v-slot:selection="{ fileNames }">
        <template v-for="fileName in fileNames" :key="fileName">
          <v-chip class="me-2" color="primary" label size="small">
            {{ fileName }}
          </v-chip>
        </template>
      </template>
    </v-file-input>
    <v-row>
      <v-col cols="12">
        <v-select :items="PackageList" multiple
                  v-model="selectedInstrumentPlans"
                  chips :rules="$rules('required|array|min:1', 'Packages')"
                  variant="solo" item-value="id" item-title="name"
                  @update:model-value="addPlan"
                  label="Packages">
        </v-select>
      </v-col>
      <v-col v-for="(plan,) in selectedInstrument.plans" cols="6" :key="plan.id">
        <v-card>
          <v-card-text>
            <v-text-field v-model="plan.name" :rules="$rules('required', 'Name')"
                          density="compact" label="Name" variant="solo-filled"></v-text-field>
            <v-text-field v-model="plan.duration" :rules="$rules('required|number', 'Duration')"
                          density="compact" label="Duration" variant="solo-filled"></v-text-field>

            <v-text-field v-model="plan.price" :rules="$rules('required|number', 'Price')"
                          density="compact" label="Price" variant="solo-filled"></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-form>
</template>
<script lang="ts" setup>
import type {InstrumentType, PlanType} from "@/stats/instrumentState";
import {onMounted, ref} from "vue";
import {instrumentState} from "@/stats/instrumentState";
import {useEventBus} from "@vueuse/core";
import {packageState} from "@/stats/packageState";

const {PackageList} = packageState();
type PushDataType = (data: { validate: boolean, data: InstrumentType }) => void;
const props = defineProps<{
  eventForValidate: string,
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const {selectedInstrument} = instrumentState();
const InstrumentForm = ref<InstrumentType>(selectedInstrument.value!)
const APP_URL = import.meta.env.VITE_APP_URL;
const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid,
    data: {...InstrumentForm.value}
  });
};
const selectedInstrumentPlans = ref<PlanType[]>(selectedInstrument.value?.plans.map((item) =>
    parseInt( item.id)))
const addPlan = (val) => {
  selectedInstrument.value.plans.forEach((item) => {
    if (!val.includes(parseInt(item.id)) ) {
      selectedInstrument.value.plans.splice(selectedInstrument.value.plans.indexOf(item), 1)
    }
  })
  val.forEach((item) => {
    let packageItem = PackageList.value.find((i) => i.id === item)
    console.log(item, packageItem ,selectedInstrument.value.plans)
    if (!selectedInstrument.value.plans.find((i) => parseInt(i.id) === packageItem.id)) {
      selectedInstrument.value.plans.push({
        id: packageItem.id,
        name: packageItem.name,
        duration: packageItem.duration,
        price: packageItem.price
      })
    }
  })
}

onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
