<template>
  <v-tooltip text="Create parent" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" icon="fa fa-plus" @click="toggleDialog = true"> </v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Create parent
      </template>
      <template v-slot:text>
        <CreateParentForm :push-data="attemptSave"
                             eventForValidate="create-parent-event"></CreateParentForm>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Create " variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import CreateParentForm from "@/views/dashboard/parent/ParentDialog/CreateParentForm.vue";
import {useParent ,exeGlobalGetParents} from "@/api/useParent";
import {useEventBus} from "@vueuse/core";

const {useCreateParent} = useParent();
const {onResultSuccess: onSuccessCreateParent, execute: exeCreateParent} = useCreateParent();
const toggleDialog = ref(false)
const {emit} = useEventBus('create-parent-event');
const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {
  exeCreateParent({
    data: res.data
  });
}
onSuccessCreateParent(() => {
  toggleDialog.value = false;
  exeGlobalGetParents();
})
</script>
