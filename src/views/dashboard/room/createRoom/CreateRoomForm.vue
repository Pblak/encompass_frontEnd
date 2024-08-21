<template>
  <v-form ref="ElForm" class="_flex _flex-col _gap-4" @submit.prevent="validateForm">
    <v-text-field variant="solo" density="comfortable"
                  v-model="roomForm.name" label="Name" :rules="$rules('required' ,'Name')"></v-text-field>
    <v-text-field variant="solo" density="comfortable"
                  v-model="roomForm.capacity" label="Capacity" :rules="$rules('required|number' ,'Capacity')"></v-text-field>

    <v-textarea
        variant="solo" density="comfortable"
        v-model="roomForm.notes"
        label="note"
        counter
        :rules="$rules('max:300' ,'note')"
    ></v-textarea>
  </v-form>
</template>
<script lang="ts" setup>
import type {RoomType} from "@/stats/roomState";
import {onMounted, ref} from "vue";
import {useEventBus} from "@vueuse/core";

type PushDataType = (data: { validate: boolean, data: RoomType }) => void;
const props = defineProps<{
  eventForValidate: {
    type: string;
    required: true;
  },
  pushData: PushDataType;
}>();
const {on} = useEventBus(props.eventForValidate as unknown as string);
const roomForm = ref<RoomType>({
  name: "",
  capacity: 0,
  notes: "",
})

const ElForm = ref<any>(null);
const validateForm = async () => {
  const {valid} = await ElForm.value.validate()
  if (!valid) return;
  props.pushData({
    validate: valid,
    data: {...roomForm.value}
  });

};
onMounted(() => {
  on(() => {
    validateForm();
  });
})
</script>
