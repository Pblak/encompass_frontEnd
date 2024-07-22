<template>
   <v-row>
      <v-col cols="12" md="4">
         <v-row>
            <v-col cols="12">
               <v-card
                 class="">
                  <v-card-title>
                     <v-text-field v-model="searchLesson" density="comfortable" flat hide-details
                                   label="Lessons" variant="outlined"></v-text-field>
                  </v-card-title>
                  <v-card-text class="_bg-gray-100 overflow-y-auto _h-[calc(100vh-10.5rem)] !_pt-4">
                     <v-row>
                        {{ LessonsSelected }}
                        <v-col v-for="lesson in LessonList" :key="lesson.id" cols="12">
                           <v-card>
                              <v-card-item
                                prepend-avatar="https://cdn.vuetifyjs.com/images/cards/foster.jpg">
                                 <v-card-title class="!_font-black !_text-sm !_text-md">{{ lesson.student.name }}
                                 </v-card-title>
                                 <v-card-subtitle class="!_text-xs">{{ lesson.student.email }}</v-card-subtitle>
                                 <template v-slot:append>
                                    <v-checkbox v-model="LessonsSelected" :value="lesson.id" hide-details></v-checkbox>
                                 </template>
                              </v-card-item>
                              <v-divider class="_border-gray-800"></v-divider>
                              <v-card-text>
                                 <VList class=" ">
                                    <v-list-item :append-avatar="APP_URL+lesson.instrument.image">
                                       <v-list-item-title>Instrument</v-list-item-title>
                                       <v-list-item-subtitle class="!_capitalize">
                                          {{ lesson.instrument.name }}
                                       </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item>
                                       <template v-slot:append>
                                          <v-badge :content="1" color="primary"></v-badge>
                                       </template>
                                       <v-list-item-title>
                                          Lessons frequency
                                       </v-list-item-title>
                                       <v-list-item-subtitle>
                                          {{ lesson.frequency }}
                                       </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item>
                                       <v-list-item-title>Teacher</v-list-item-title>
                                       <v-list-item-subtitle class="!_capitalize">{{
                                             lesson.teacher.name
                                          }}
                                       </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item @click="planningsToggle(lesson.id+'_planning')">
                                       <v-list-item-title>Schedule</v-list-item-title>
                                       <v-list-item-subtitle class="!_capitalize">
                                          Lesson's planning
                                       </v-list-item-subtitle>
                                       <template v-slot:append>
                                          <v-icon>{{
                                                !planningsContainers.includes((lesson.id) as string + '_planning') ?
                                                  'fa-thin fa-caret-down' : 'fa-thin fa-caret-up'
                                             }}
                                          </v-icon>
                                       </template>
                                    </v-list-item>
                                 </VList>
                                 <v-expansion-panels v-model="planningsContainers" class="!_p-0" multiple>
                                    <v-expansion-panel :value="lesson.id+'_planning'" elevation="0">
                                       <v-expansion-panel-text>
                                          <v-divider class="_border-gray-800 !_py-4"></v-divider>
                                          <v-row style="margin: -2rem;">
                                             <v-col v-for="day in Object.keys(transformDataToDays(lesson.planning))"
                                                    :key="day"
                                                    cols="4">
                                                <div class="_flex _flex-col _gap-4">
                                                   <span class="_capitalize _font-bold _text-xs">{{ day }}</span>
                                                   <v-chip v-for="item in transformDataToDays(lesson.planning)[day]"
                                                           :key="item.id"
                                                           color="secondary">
                                       <span class="_text-xs">
                                          {{ moment(item.time, 'h:mm:ss A').format('hh:mm A') }}
                                       </span>
                                                   </v-chip>
                                                   <div v-if="transformDataToDays(lesson.planning)[day].length === 0"
                                                        class="_text-center">
                                                      <span class="_text-xs _text-gray-400">----</span>
                                                   </div>
                                                </div>
                                             </v-col>
                                          </v-row>
                                       </v-expansion-panel-text>
                                    </v-expansion-panel>
                                 </v-expansion-panels>
                              </v-card-text>
                              <v-divider class="_border-gray-800"></v-divider>
                              <v-card-actions>
                              </v-card-actions>
                           </v-card>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </v-col>
      <v-col cols="12" md="8">
         <v-row>
            <v-col cols="12">
               <v-card>
                  <v-card-item>
                     <v-card-title>Instrument</v-card-title>
                  </v-card-item>
                  <v-card-text class="!_p-2 _bg-gray-200">
                     <div class="_flex _gap-4">
                        <v-col v-for="item in lessonsInstrument" :key="item.id" class="!_p-0"
                               md="3" sm="3">
                           <v-card>
                              <v-lazy>
                                 <v-img
                                   :src="APP_URL+item.image"
                                   class="align-end"
                                   contain
                                   gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)" height="130px">
                                    <v-card-title class="text-white !_capitalize">{{ item.name }}</v-card-title>
                                    <template v-slot:error>
                                       <v-img
                                         :src="APP_URL+item.image"
                                         class="mx-auto"
                                         height="130px"
                                         max-width="500"
                                       ></v-img>
                                    </template>
                                 </v-img>
                              </v-lazy>
                           </v-card>
                        </v-col>
                     </div>
                  </v-card-text>
               </v-card>
            </v-col>
            <v-col cols="12">
               <v-card class="">
                  <v-card-text>
                     <FullCalendar ref="cal" :options="calendarOptions"/>
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
        
         
      </v-col>
   </v-row>
   <v-dialog v-model="calDialog" width="auto">
      <v-card density="compact" width="400">
         <v-tabs v-model="calDialogTabs">
            <v-tab value="one">create Event</v-tab>
            <v-tab value="two">Item Two</v-tab>
            <v-tab value="three">Item Three</v-tab>
         </v-tabs>
         <v-card-text class="!_p-0">
            <v-tabs-window v-model="calDialogTabs" class="_p-4">
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
      </v-card>
   </v-dialog>
</template>
<script lang="ts" setup>
import {flatten} from 'lodash'
import moment from "moment";
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {calendarState} from '@/stats/calendarState'
import {lessonState} from '@/stats/lessonState'
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useEvent} from "@/api/useEvent";
import createEventForm from '@/components/_createEventForm.vue'
import {useLesson} from "@/api/useLesson";

const APP_URL = import.meta.env.VITE_APP_URL;
const cal = ref(null)
const calDialog = ref(false)
const calDialogTabs = ref('one')
const searchLesson = ref('')
const {rangeSelected, EventList} = calendarState()
const {LessonList, LessonsSelected} = lessonState()
const {useGetEvents} = useEvent();
const {useGetLessons} = useLesson();
const {
   execute: exeGetLessons,
   onResultSuccess: onGetLessonsSuccess,
} = useGetLessons()

const calendarOptions = reactive({
   plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
   initialView: 'timeGridWeek',
   themeSystem: 'Lumen',
   events: EventList.value,
   dateClick: (info: any) => {
      calDialog.value = true
      rangeSelected.value = info.dateStr
   },
})
const transformDataToDays = (planningData: any) => {
   const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
   const transformedData: { [key: string]: any[] } = {};
   daysOfWeek.forEach((day: string) => {
      transformedData[day] = [];
   });
   for (const day in planningData) {
      if (planningData.hasOwnProperty(day)) {
         const dayIndex = parseInt(day, 10);
         transformedData[daysOfWeek[dayIndex]] = planningData[day];
      }
   }
   return (transformedData);
}
const renderEvent = () => {
   // get from lessons lessens Selected using lessons
   // then render the event
   const selectedLessons = LessonList.value.filter((lesson: any) => LessonsSelected.value.includes(lesson.id))
   const events = selectedLessons.map((lesson: any) => {
      let instances = lesson.instances.map((instance: any) => {
         return {
            title: lesson.student.name + ' | ' + lesson.instrument.name,
            start: instance.start,
            end: moment(instance.start).add(instance.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            extendedProps: {
               lessonId: lesson.id,
               instanceId: instance.id,
               status: instance.status,
               start: instance.start
            },
            color: instance.status === 'scheduled' ? '#0b6ab9' : instance.status === 'in_progress' ? 'yellow' : instance.status === 'completed' ? 'green' : 'red',
         }
      })
      return flatten(instances)
   })
   calendarOptions.events = flatten(events)
}

const lessonsInstrument = computed(() => {
   let instruments = LessonList.value.map((lesson: any) => lesson.instrument)
   // make it unique
   return [...new Set(instruments)]
})

onMounted(() => {
   exeGetLessons()
   renderEvent()
})
onGetLessonsSuccess((res: any) => {
   LessonList.value = res.data
})

useGetEvents().execute()

useGetEvents().onResultSuccess((res: any) => {
   EventList.value = res.data
})


watch(EventList, (newVal) => {
   calendarOptions.events = newVal
})

watch(() => LessonsSelected.value, (newVal) => {
   renderEvent()
}, {deep: true})

watch(() => LessonList.value, (newVal) => {
   renderEvent()
}, {deep: true}) 

const planningsContainers = ref([])
const planningsToggle = (planning: number | string) => {
   // if planning is already in the array remove it
   // else add it
   if (planningsContainers.value.includes(planning as never)) {
      planningsContainers.value = planningsContainers.value.filter(item => item !== planning)
   } else {
      planningsContainers.value.push(planning as never)
   }
   
}

</script>