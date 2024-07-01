<template>
  <div>
    <v-card class="_w-7/12">
      <v-card-title>Monitor</v-card-title>
      <v-card-text>
        <FullCalendar ref="cal" :options="calendarOptions"/>
        <v-dialog v-model="calDialog" width="auto">
          <v-card width="400" density="compact">

            <v-tabs v-model="calDialogTabs">
              <v-tab value="one">create Event</v-tab>
              <v-tab value="two">Item Two</v-tab>
              <v-tab value="three">Item Three</v-tab>
            </v-tabs>
            <v-card-text class="!_p-0">

              <v-tabs-window class="_p-4" v-model="calDialogTabs">
                <v-tabs-window-item value="one">
                  <!-- create event form-->
                  <create-event-form></create-event-form>
                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                  Two
                </v-tabs-window-item>

                <v-tabs-window-item value="three">
                  Three
                </v-tabs-window-item>
              </v-tabs-window>


            </v-card-text>
            <template v-slot:actions>
              <v-btn
                  class="ms-auto"
                  text="Ok"
                  @click="calDialog = false"
              ></v-btn>
            </template>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {calendarState} from '@/stats/calendarState'
import {reactive, ref, watch} from 'vue'
import {useEvent} from "@/api/useEvent";
import createEventForm from '@/components/_createEventForm.vue'

const cal = ref(null)
const calDialog = ref(false)
const calDialogTabs = ref('one')
const {rangeSelected, EventList} = calendarState()
const {useGetEvents} = useEvent();

const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: EventList.value,
  dateClick: (info: any) => {
    calDialog.value = true
    rangeSelected.value = info.dateStr
  },
})

useGetEvents().execute()

useGetEvents().onResultSuccess((res) => {
  EventList.value = res.data
})

watch(EventList, (newVal) => {
  calendarOptions.events = newVal
})
</script>
