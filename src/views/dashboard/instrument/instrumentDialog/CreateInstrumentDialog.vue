<template>
   <v-tooltip location="bottom" text="Create student">
      <template v-slot:activator="{ props }">
         <v-btn color="primary" icon="fa fa-plus" v-bind="props" @click="toggleCreate"></v-btn>
      </template>
   </v-tooltip>
   <v-dialog v-model="instrumentDialog" scrollable width="auto">
      <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
         <template v-slot:title>
            {{ createMode ? 'Create Instrument' : 'Update Instrument ' + selectedInstrument!.name }}
         </template>
         <template v-slot:text>
            <CreateInstrumentForm v-if="createMode" :eventForValidate="eventBusName" :push-data="attemptSave"/>
            <UpdateInstrumentForm v-else :eventForValidate="eventBusName" :push-data="attemptSave"/>
         </template>
         <template v-slot:actions>
            <v-btn class="ms-auto" color="success"
                   :text="createMode ? 'Create' : 'Update'"
                   variant="tonal" @click="sendEvent"></v-btn>
         </template>
      </v-card>
   </v-dialog>
</template>
<script lang="ts" setup>
import {exeGlobalGetInstruments, useInstrument} from "@/api/useInstrument";
import {useEventBus} from "@vueuse/core";
import CreateInstrumentForm from "@/views/dashboard/instrument/instrumentDialog/CreateInstrumentForm.vue";
import UpdateInstrumentForm from "@/views/dashboard/instrument/instrumentDialog/UpdateInstrumentForm.vue";
import {instrumentState} from "@/stats/instrumentState";
import {ref, watch} from "vue";

const {useCreateInstrument, useUpdateInstrument} = useInstrument();
const {instrumentDialog, selectedInstrument} = instrumentState();
const createMode = ref(!selectedInstrument.value);
const eventBusName = !selectedInstrument.value ? 'create-instrument-event' : 'update-instrument-event';
const {
   onResultSuccess: onSuccessCreateInstrument, execute: exeCreateInstrument
} = useCreateInstrument();
const {
   onResultSuccess: onSuccessUpdateInstrument, execute: exeUpdateInstrument
} = useUpdateInstrument();
const {
   emit
} = useEventBus(eventBusName);
const sendEvent = () => {
   console.log(eventBusName)
   emit();
}
const attemptSave = (res) => {
   if(createMode.value) {
      exeCreateInstrument({
         data: res.data
      });
   } else {
      exeUpdateInstrument({
         data: res.data
      });
   }
   // exeCreateInstrument({
   //    data: res.data
   // });
}
const toggleCreate = () => {
   instrumentDialog.value = !instrumentDialog.value;
   selectedInstrument.value = null;
}
onSuccessCreateInstrument(() => {
   instrumentDialog.value = false;
   exeGlobalGetInstruments();
})
onSuccessUpdateInstrument(() => {
   instrumentDialog.value = false;
   exeGlobalGetInstruments();
})
watch(instrumentDialog, (val) => {
   if(!val) {
      selectedInstrument.value = null;
   }
})
watch(selectedInstrument, (val) => {
   createMode.value = !val;
})
</script>
