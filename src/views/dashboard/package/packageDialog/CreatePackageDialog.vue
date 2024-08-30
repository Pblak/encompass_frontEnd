<template>
   <v-tooltip location="bottom" text="Create student">
      <template v-slot:activator="{ props }">
         <v-btn color="primary" icon="fa fa-plus" v-bind="props" @click="toggleCreate"></v-btn>
      </template>
   </v-tooltip>
   <v-dialog v-model="packageDialog" scrollable width="auto">
      <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
         <template v-slot:title>
            {{ createMode ? 'Create Package' : 'Update Package ' + selectedPackage!.name }}
         </template>
         <template v-slot:text>
            <CreatePackageForm v-if="createMode" :eventForValidate="eventBusName" :push-data="attemptSave"/>
            <UpdatePackageForm v-else :eventForValidate="eventBusName" :push-data="attemptSave"/>
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
import {exeGlobalGetPackages, usePackage} from "@/api/usePackage";
import {useEventBus} from "@vueuse/core";
import CreatePackageForm from "@/views/dashboard/package/packageDialog/CreatePackageForm.vue";
import UpdatePackageForm from "@/views/dashboard/package/packageDialog/UpdatePackageForm.vue";
import {packageState} from "@/stats/packageState";
import {ref, watch} from "vue";

const {useCreatePackage, useUpdatePackage} = usePackage();
const {packageDialog, selectedPackage} = packageState();
const createMode = ref(!selectedPackage.value);
const eventBusName = !selectedPackage.value ? 'create-package-event' : 'update-package-event';
const {
   onResultSuccess: onSuccessCreatePackage, execute: exeCreatePackage
} = useCreatePackage();
const {
   onResultSuccess: onSuccessUpdatePackage, execute: exeUpdatePackage
} = useUpdatePackage();
const {
   emit
} = useEventBus(eventBusName);
const sendEvent = () => {
   console.log(eventBusName)
   emit();
}
const attemptSave = (res) => {
   if(createMode.value) {
      exeCreatePackage({
         data: res.data
      });
   } else {
      exeUpdatePackage({
         data: res.data
      });
   }
   // exeCreatePackage({
   //    data: res.data
   // });
}
const toggleCreate = () => {
   packageDialog.value = !packageDialog.value;
   selectedPackage.value = null;
}
onSuccessCreatePackage(() => {
   packageDialog.value = false;
   exeGlobalGetPackages();
})
onSuccessUpdatePackage(() => {
   packageDialog.value = false;
   exeGlobalGetPackages();
})
watch(packageDialog, (val) => {
   if(!val) {
      selectedPackage.value = null;
   }
})
watch(selectedPackage, (val) => {
   createMode.value = !val;
})
</script>
