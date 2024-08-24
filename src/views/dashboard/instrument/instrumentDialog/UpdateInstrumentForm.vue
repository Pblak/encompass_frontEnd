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
        prepend-icon=""  variant="solo" density="comfortable"
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
         <v-col class="_flex _items-center _gap-2" cols="12">
            <v-btn color="primary" icon @click="addPlan()">
               <v-icon>fa-solid fa-plus</v-icon>
            </v-btn>
            <p>Add new plan</p>
         </v-col>
         <v-col v-for="(plan,) in selectedInstrument.plans" cols="6">
            <v-card>
               <v-card-title class="">
                  <div class="_flex _justify-end">
                     <v-btn :disabled="selectedInstrument.plans && selectedInstrument?.plans.length <= 1"
                            color="red"
                            density="compact" icon
                            @click="removePlan(plan)">
                        <v-icon size="12">fa-duotone fa-trash</v-icon>
                     </v-btn>
                  </div>
               </v-card-title>
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

type PushDataType = (data: { validate: boolean, data: InstrumentType }) => void;
const props = defineProps<{
  eventForValidate:string,
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const { selectedInstrument} = instrumentState();
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

const addPlan = () => {
   if(selectedInstrument.value!.plans.length >= 3) return
   // create plan id from existing plan id
   let id = selectedInstrument.value!.plans[selectedInstrument.value!.plans.length - 1].id + 1
   selectedInstrument.value!.plans.push({
      id: id, name: "", duration: "", price: "",
   })
}
const removePlan = (plan: PlanType) => {
   
   if(selectedInstrument.value && selectedInstrument.value!.plans.length <= 1) return
   selectedInstrument.value!.plans.splice(selectedInstrument.value!.plans.indexOf(plan), 1)
   //  adjust the id of  each plan remaining
   selectedInstrument.value!.plans.forEach((item, index) => {
      item.id = index + 1
   })

}

onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
