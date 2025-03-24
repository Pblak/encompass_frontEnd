<template>
  <v-tooltip text="Update parent" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary"
             density="comfortable"
             icon="fa fa-edit !_text-sm"
             @click="toggleDialog = true"> </v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="toggleDialog" scrollable width="auto">
    <v-card prepend-icon="fa-duotone fa-graduation-cap" width="600">
      <template v-slot:title>
        Update parent
      </template>
      <template v-slot:text>
        <UpdateParentForm :push-data="attemptSave"
                          :parent-selected="parentSelected"
                             eventForValidate="update-parent-event"></UpdateParentForm>
      </template>
      <template v-slot:actions>
        <v-btn class="ms-auto" color="success" text="Update " variant="tonal" @click="sendEvent"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import UpdateParentForm from "@/views/dashboard/parent/ParentDialog/UpdateParentForm.vue";
import {useParent ,exeGlobalGetParents} from "@/api/useParent";
import {useEventBus} from "@vueuse/core";
import type {ParentType} from "@/stats/parentState";

defineProps<{
  parentSelected:ParentType
}>();
const {useUpdateParent} = useParent();
const {onResultSuccess: onSuccessUpdateParent, execute: exeUpdateParent} = useUpdateParent();
const toggleDialog = ref(false)
const {emit} = useEventBus('update-parent-event');
const sendEvent = () => {
  emit();
};

const attemptSave = (res) => {
  exeUpdateParent({
    data: res.data
  });
}
onSuccessUpdateParent(() => {
  toggleDialog.value = false;
  exeGlobalGetParents();
})
</script>
