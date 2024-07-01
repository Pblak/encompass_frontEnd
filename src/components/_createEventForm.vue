<script setup lang="ts">
import {type Ref, ref} from 'vue'
import {calendarState} from "@/stats/calendarState";
import {useEvent} from "@/api/useEvent";

const {useCreateEvent} = useEvent();
const {rangeSelected} = calendarState()
const eventValidate = ref(false);
const eventFormRef: Ref<null | HTMLFormElement> = ref<null | HTMLFormElement>(null)
const createEvent = () => {
  if (eventValidate.value) {
    eventValidate.value = false;
    useCreateEvent().execute({params: eventForm.value});
    eventFormRef.value?.reset();
  }
};
const eventForm = ref({
  title: '',
  start: rangeSelected.value,
  end: ''
});

useCreateEvent().onResultSuccess(() => {
  eventValidate.value = true;
});
</script>

<template>
  <v-form v-model="eventValidate" ref="eventFormRef" @submit.prevent="createEvent">
    {{ rangeSelected }}
    <v-text-field
        v-model="eventForm.title"
        label="Title"
        type="number"
        required
    ></v-text-field>
    <v-text-field
        v-model="eventForm.start"
        label="Start" type="date" required
    ></v-text-field>
    <v-text-field
        v-model="eventForm.end"
        label="End" type="date" required
    ></v-text-field>
    <v-btn type="submit">Next</v-btn>
  </v-form>
</template>
