<template>
  <v-form ref="ElForm" @submit.prevent="validateForm">
    <v-text-field v-model="InstrumentForm.name" :rules="$rules('required', 'Name')"
                  density="comfortable" label="Name" variant="solo"></v-text-field>
    <v-file-input v-model="InstrumentForm.image as File" :rules="$rules('required', 'Image')"
                  density="comfortable"
                  label="Select your image"
                  placeholder="Select your image" prepend-icon="" show-size
                  variant="solo">
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
        <v-select :items="PackageList" multiple chips
                  :rules="$rules('required|array|min:1','Packages')"
                  variant="solo" item-value="id" item-title="name"
                  @update:model-value="addPlan"
                  label="Packages">
        </v-select>
      </v-col>
      <v-col v-for="(plan ,i) in InstrumentForm.plans" :key="i" cols="6">
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
import type {InstrumentType} from "@/stats/instrumentState";
import type {PackageType } from "@/stats/packageState";
import {packageState } from "@/stats/packageState";
import {onMounted, ref} from "vue";
import {useEventBus} from "@vueuse/core";

type PushDataType = (data: { validate: boolean, data: InstrumentType }) => void;
const {PackageList } = packageState();

const props = defineProps<{
  eventForValidate: string, pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);

const InstrumentForm = ref<InstrumentType>({
  description: "",
  id: 0,
  name: "",
  image: null,
  plans: []
})

const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid, data: {...InstrumentForm.value}
  });
};
const addPlan = (val) => {
  InstrumentForm.value.plans.forEach((item) => {
    if (!val.includes(item.id)) {
      InstrumentForm.value.plans.splice(InstrumentForm.value.plans.indexOf(item), 1)
    }
  })
  val.forEach((item) => {
    let packageItem = PackageList.value.find((i ) => i.id === item)

    if (!InstrumentForm.value.plans.find((i) => i.id === packageItem!.id)  ) {
      InstrumentForm.value.plans.push({
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
