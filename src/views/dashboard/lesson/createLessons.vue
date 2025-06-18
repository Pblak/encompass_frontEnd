<template>
  <v-card :subtitle="isRenewMode ? 'Renewing lesson for continued learning' : 'Create a new lesson register'" :title="isRenewMode ? 'Renew Lesson' : 'Create Lesson'">
    <template v-slot:append>
      <v-chip color="green !_font-black">
        <v-tooltip activator="parent" location="bottom">Total price</v-tooltip>
        {{ calculatePrice() }}
      </v-chip>
    </template>
    <template v-slot:prepend>
      <div class="_relat ive ">
        <v-icon size="30" color="orange">fa-thin fa-list-music</v-icon>
      </div>
    </template>
    <v-divider class="_border-gray-800" thickness="1"></v-divider>
    <v-form ref="FormEl">
      <v-card-text class="_bg-gray-100 overflow-y-auto _h-[calc(100vh-10rem)]">
        <v-row>
          <v-col cols="12" lg="4" md="4" sm="12">
            <!-- Renewal Information -->
            <v-row v-if="isRenewMode && originalLesson">
              <v-col cols="12">
                <v-alert type="info" variant="tonal" class="_mb-4">
                  <v-alert-title>Renewing Lesson</v-alert-title>
                  <div class="_mt-2">
                    <p><strong>Student:</strong> {{ originalLesson.student?.name }}</p>
                    <p><strong>Teacher:</strong> {{ originalLesson.teacher?.name }}</p>
                    <p><strong>Instrument:</strong> {{ originalLesson.instrument?.name }}</p>
                    <p><strong>Previous sessions:</strong> {{ originalLesson.instances?.length || 0 }}</p>
                    <p><strong>New lessons will start after the current series</strong></p>
                  </div>
                </v-alert>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" lg="6">
                <v-select v-model="formData.teacher_id" :items="TeacherList"
                          :rules="$rules('required|number' ,'Teacher')" density="compact" item-title="name"
                          item-value="id" @change="selectTeacher"
                          label="Teacher" variant="solo"></v-select>
              </v-col>
              <v-col cols="12" lg="6">
                <v-select v-model="formData.student_id" :items="StudentList"
                          :rules="$rules('required|number' ,'Student')" density="compact" item-title="name"
                          item-value="id" @change="selectStudent"
                          label="Student" variant="solo"></v-select>
              </v-col>
              <v-col cols="12" lg="6" v-if="InstrumentList">
                <v-select v-model="formData.instrument_id" :items="InstrumentList"
                          :rules="$rules('required|number' ,'Instrument')" density="compact" item-title="name"
                          item-value="id" label="Instrument" variant="solo"></v-select>
              </v-col>
              <v-col cols="12" lg="6">
                <v-select v-model="formData.room_id" :items="RoomList"
                          :rules="$rules('required|number' ,'Room')" density="compact" item-title="name"
                          item-value="id" label="Room" variant="solo"></v-select>
              </v-col>
              <v-col cols="12" lg="6" >
                <v-text-field v-model="formData.frequency"
                              :rules="$rules('required|number' ,'Duration')" density="compact" label="Frequency"
                              variant="solo">
                  <template v-slot:append>
                    <v-tooltip activator="parent" location="bottom">
                      How many times the planing will repeat
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="6" >
                <v-select v-model="formData.instrument_plan" :items="getPlans" :rules="$rules('object' ,'Plan')"
                          density="compact" item-title="name"
                          label="Plan" return-object variant="solo"></v-select>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-text>
                    <v-date-picker width="100%"
                                   :model-value="formData.start_date ? new Date(formData.start_date) : null"
                                   :min="moment().add('6','hours').format('YYYY-MM-DD')"
                                   @update:modelValue="(value: any) => updateLessonStartDate(value)"></v-date-picker>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col v-if="formData.instrument_plan" cols="12">
                <v-card :title="formData.instrument_plan.name" subtitle="These values are for each lesson">
                  <v-card-text>
                    <v-list>
                      <v-list-item title="Price">
                        <template v-slot:append>
                          <v-chip color="green">
                            {{ toCurrency(formData.instrument_plan.price) }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      <v-list-item title="Duration">
                        <template v-slot:append>
                          <v-chip color="purple">
                            {{ moment.duration(formData.instrument_plan.duration, 'minutes').humanize() }}
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formData.notes" :rules="$rules('max:255' ,'Notes')" counter
                            dense label="Notes" variant="solo"></v-textarea>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="8" md="8" sm="12">
            <v-card>
              <v-card-title>
                <div class="_flex _gap-4 _flex-wrap _py-4">
                  <template
                      v-for="i in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                      :key="i">
                    <v-chip :color="getPlaningDay(i as string).length >0 ?'cyan':''"
                            size="small">
                      <v-badge v-if="getPlaningDay(i as string).length>0"
                               :content="getPlaningDay(i as string).length"
                               color="success" inline></v-badge>
                      {{ i }}
                      <v-badge v-if="getPlaningDayTeacherMarker(i as string).length>0"
                               :content="getPlaningDayTeacherMarker(i as string).length"
                               color="error" inline></v-badge>
                      <v-badge v-if="getPlaningDayStudentMarker(i as string).length>0"
                               :content="getPlaningDayStudentMarker(i as string).length"
                               color="warning" inline></v-badge>
                    </v-chip>
                  </template>
                </div>
              </v-card-title>
              <v-card-text>
                <FullCalendar ref="cal" :options="calendarOptions as any"/>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" prepend-icon="fa fa-plus" variant="tonal"
               @click.prevent="save">Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import {teacherState} from "@/stats/teacherState";
import {studentState} from "@/stats/studentState";
import {instrumentState} from "@/stats/instrumentState";
import {roomState} from "@/stats/roomState";
import {lessonState} from "@/stats/lessonState";
import FullCalendar from "@fullcalendar/vue3";
import {watch, onMounted} from 'vue';
import {exeGlobalGetLessons, useLesson} from "@/api/useLesson";
import {toCurrency} from "@/stats/Utils";
import moment from "moment";

import {useCalendarLogic} from "@/composables/useCalendarLogic";
import {useLessonForm} from "@/composables/useLessonForm";
import {useTeacherStudentSelection} from "@/composables/useTeacherStudentSelection";
import {useRenewLesson} from "@/composables/useRenewLesson";
import {useRoute} from "vue-router";

const {TeacherList} = teacherState();
const {StudentList} = studentState();
const {InstrumentList} = instrumentState();
const {RoomList} = roomState();
const {LessonList} = lessonState();
const route = useRoute();

const {FormEl, formData, getPlans, calculatePrice, resetForm, prefillForm, getPlaningDay} = useLessonForm(InstrumentList);
const {isRenewMode, originalLesson, initializeRenewal, resetRenewal, extractPlanningFromInstances, calculateFrequencyFromInstances} = useRenewLesson();

const {
  cal,
  calendarOptions,
  createFakeLessonInstances,
  addEvent,
  removeEvent,
  updateLessonStartDate,
  prefillCalendarEvents,
  prefillPlanningEvents
} = useCalendarLogic(formData);

const {
  selectTeacher,
  selectStudent,
  getPlaningDayTeacherMarker,
  getPlaningDayStudentMarker
} = useTeacherStudentSelection(formData, calendarOptions);

const {useCreateLesson} = useLesson()
const {
  execute: exeCreateLesson,
  onResultSuccess: onResultSuccessCreateLesson,
} = useCreateLesson();

calendarOptions.value.select = addEvent;
calendarOptions.value.eventClick = removeEvent;

const save = async () => {
  if (!FormEl.value) return;
  let {valid} = await (FormEl.value as any).validate()
  if (!valid) return;
  await exeCreateLesson({
    data: formData.value
  })
}

onResultSuccessCreateLesson(() => {
  resetForm()
  resetRenewal()
  calendarOptions.value.events = []
  exeGlobalGetLessons({})
})

// Handle renewal mode initialization
const initializeRenewalMode = () => {
  if (route.query.renew === 'true' && route.query.lessonId) {
    const lessonId = parseInt(route.query.lessonId as string)
    
    // Find the lesson in the lesson list
    const lesson = LessonList.value.find(l => l.id === lessonId)
    
    if (lesson && lesson.instances) {
      initializeRenewal(lesson)
      
      // Transform lesson data for form prefilling
      const extractedPlanning = extractPlanningFromInstances(lesson.instances)
      
      const renewalData = {
        teacher_id: lesson.teacher_id || '',
        student_id: lesson.student_id || '',
        instrument_id: lesson.instrument_id || '',
        room_id: lesson.room_id || '',
        planning: extractedPlanning,
        frequency: calculateFrequencyFromInstances(lesson.instances),
        instrument_plan: lesson.instrument_plan || null,
        start_date: calculateNextStartDate(lesson.instances),
        price: 0,
        active: 1,
        notes: lesson.notes || ''
      }
      
      // Prefill form with renewal data
      prefillForm(renewalData)
      
      // Set the plan after a small delay to ensure instrument selection triggers plan loading
      setTimeout(() => {
        if (lesson.instrument_plan && formData.value.instrument_id) {
          // Find matching plan in the available plans for the selected instrument
          const availablePlans = getPlans.value
          
          // Try to match by id (if instrument_plan is an object with id)
          let matchingPlan = availablePlans?.find((plan: any) => 
            plan.id === (typeof lesson.instrument_plan === 'object' ? lesson.instrument_plan.id : lesson.instrument_plan)
          )
          
          // If no match found by id, try to match by plan itself if it's already the right object
          if (!matchingPlan && typeof lesson.instrument_plan === 'object') {
            matchingPlan = availablePlans?.find((plan: any) => 
              plan.id === lesson.instrument_plan.id && plan.name === lesson.instrument_plan.name
            )
          }
          
          if (matchingPlan) {
            formData.value.instrument_plan = matchingPlan
          }
        }
        
        // Generate events from the planning data
        if (formData.value.instrument_plan && formData.value.planning) {
          // Create events directly from planning data
          Object.keys(formData.value.planning).forEach(dayKey => {
            const day = parseInt(dayKey)
            const slots = formData.value.planning[day]
            
            slots.forEach(slot => {
              // Calculate the date for this day relative to start_date
              const startDate = moment(formData.value.start_date)
              const startDayOfWeek = startDate.day()
              
              // Calculate offset from start_date to target day within the same planning week
              let dayOffset = (day - startDayOfWeek) % 7
              if (dayOffset < 0) dayOffset += 7 // Ensure positive offset for future days
              
              const eventDate = startDate.clone().add(dayOffset, 'days')
              const [hours, minutes, seconds] = slot.time.split(':')
              eventDate.hour(parseInt(hours))
              eventDate.minute(parseInt(minutes))
              eventDate.second(parseInt(seconds))
              
              const startTime = eventDate.format('YYYY-MM-DD HH:mm:ss')
              const endTime = eventDate.clone().add(formData.value.instrument_plan.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss')
              
              const event = {
                title: 'Lesson',
                start: startTime,
                end: endTime,
                allDay: false,
                className: 'lesson-event',
                extendedProps: {
                  lessonPlan: true,
                  marker: false,
                  fake: false
                }
              }
              
              calendarOptions.value.events.push(event)
            })
          })
        }
        
        // Generate fake events for future weeks based on frequency
        setTimeout(() => {
          createFakeLessonInstances()
        }, 100)
      }, 300)
      
      // Don't show previous instances during renewal - let the calendar show only the new planning
    }
  }
}

// Calculate next start date helper
const calculateNextStartDate = (instances: any[]) => {
  if (!instances || instances.length === 0) {
    return moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  }

  // Sort instances by start date to find first and last
  const sortedInstances = [...instances].sort((a, b) => 
    moment(a.start).isBefore(moment(b.start)) ? -1 : 1
  )

  const firstInstance = sortedInstances[0]
  const lastInstance = sortedInstances[sortedInstances.length - 1]
  
  const firstInstanceDate = moment(firstInstance.start)
  const lastInstanceDate = moment(lastInstance.start)
  
  // Calculate how many days after the last instance we should start
  // We want to start on the same day of week as the first instance, but in the week after the last instance
  const dayOfWeekOfFirst = firstInstanceDate.day()
  
  // Start from the day after the last instance
  let nextStartDate = lastInstanceDate.clone().add(1, 'day')
  
  // Find the next occurrence of the same day of week as the first instance
  while (nextStartDate.day() !== dayOfWeekOfFirst) {
    nextStartDate = nextStartDate.add(1, 'day')
  }
  
  // Set the time to match the first instance
  nextStartDate.hour(firstInstanceDate.hour())
  nextStartDate.minute(firstInstanceDate.minute())
  nextStartDate.second(firstInstanceDate.second())
  
  return nextStartDate.format('YYYY-MM-DD HH:mm:ss')
}

// Initialize renewal mode when component mounts
onMounted(() => {
  initializeRenewalMode()
})

// Watch for lesson list changes to handle renewal initialization
watch(() => LessonList.value, () => {
  if (LessonList.value.length > 0) {
    initializeRenewalMode()
  }
}, { immediate: true })

watch(() => formData.value.instrument_id, () => {
  // Don't clear instrument_plan during renewal mode initialization
  // The plan should be preserved from the original lesson
  if (!isRenewMode.value) {
    formData.value.instrument_plan = null;
    formData.value.planning = {};
  }
  calendarOptions.value.events = calendarOptions.value.events.filter((event: any) => {
    return event.extendedProps.marker
  })
}, {deep: true})

watch(() => formData.value.instrument_plan, () => {
  // Don't clear planning during renewal mode initialization
  // The planning should be preserved from the original lesson
  if (!isRenewMode.value) {
    formData.value.planning = {};
  }
  calendarOptions.value.events = calendarOptions.value.events.filter((event: any) => {
    return event.extendedProps.marker
  })
}, {deep: true})

watch(() => formData.value.teacher_id, () => {
  selectTeacher()
}, {deep: true})

watch(() => formData.value.student_id, () => {
  selectStudent()
}, {deep: true})

// Watch for plans becoming available during renewal to set the plan
watch(() => getPlans.value, (newPlans) => {
  if (isRenewMode.value && originalLesson.value && newPlans && newPlans.length > 0) {
    // If we're in renewal mode and don't have a plan selected yet
    if (!formData.value.instrument_plan && originalLesson.value.instrument_plan) {
      const matchingPlan = newPlans.find((plan: any) => 
        plan.id === originalLesson.value!.instrument_plan.id
      )
      if (matchingPlan) {
        formData.value.instrument_plan = matchingPlan
      }
    }
  }
}, { immediate: true })

watch(() => formData.value.frequency, () => {
  createFakeLessonInstances()
}, {deep: true})

watch(() => formData.value.start_date, () => {
  calendarOptions.value.events = calendarOptions.value.events.filter((event: any) => {
    return event.extendedProps.marker
  })
  calendarOptions.value.initialDate = moment(formData.value.start_date).format('YYYY-MM-DD');
  calendarOptions.value.firstDay = moment(formData.value.start_date).day();
  calendarOptions.value.visibleRange = {
    start: moment(formData.value.start_date).format('YYYY-MM-DD'),
    end: moment(formData.value.start_date).add(7, 'days').format('YYYY-MM-DD')
  };

  if (cal.value) {
    const calendarApi = cal.value.getApi();
    calendarApi.gotoDate(moment(formData.value.start_date).format('YYYY-MM-DD'));
    calendarApi.setOption('visibleRange', {
      start: moment(formData.value.start_date).format('YYYY-MM-DD'),
      end: moment(formData.value.start_date).add(7, 'days').format('YYYY-MM-DD')
    });
  }
}, {deep: true})

watch(() => calendarOptions.value.events, (newVal) => {
  // Don't rebuild planning from calendar events during renewal initialization
  // The planning should come from the original lesson data
  if (!isRenewMode.value) {
    formData.value.planning = {};
    newVal.map((ev: any) => {
      let day = new Date(ev.start).getDay();
      if (!ev.extendedProps.marker && !ev.extendedProps.fake) {
        if (!formData.value.planning[day]) formData.value.planning[day] = [];
        formData.value.planning[day].push({
          time: moment(ev.start).format('HH:mm:ss'),
          day: day
        })
      }
    })
  }
}, {deep: true})
</script>

<style scoped>
@import '@/styles/lessonCalendar.css';

/* Renewal-specific styles */
:deep(.previous-lesson-instance) {
  background-color: #e3f2fd !important;
  border-color: #1976d2 !important;
  color: #1976d2 !important;
  opacity: 0.7;
}

:deep(.renewed-lesson-event) {
  background-color: #fff3e0 !important;
  border-color: #f57c00 !important;
  color: #f57c00 !important;
}

:deep(.existing-lesson-instance) {
  background-color: #ce70dc !important;
  border-color: #7b1fa2 !important;
  color: #7b1fa2 !important;
  opacity: 0.8;
}
</style>