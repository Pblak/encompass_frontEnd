<template>
  <v-card subtitle="Create a new lesson register" title="Create Lesson">
    <template v-slot:append>
      <v-chip color="green !_font-black">
        <v-tooltip activator="parent" location="bottom">Total price</v-tooltip>
        {{ calculatePrice() }}
      </v-chip>
    </template>
    <template v-slot:prepend>
      <v-icon size="30">fa-thin fa-list-music</v-icon>
    </template>
    <v-divider class="_border-gray-800" thickness="1"></v-divider>
    <v-form ref="FormEl">
      <v-card-text class="_bg-gray-100 overflow-y-auto _h-[calc(100vh-10rem)]">
        <v-row>
          <v-col cols="12" lg="4" md="4" sm="12">
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
                          density="compact" item-title="name" item-value="id"
                          label="Plan" return-object variant="solo"></v-select>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-text>
                    <v-date-picker width="100%"
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
import FullCalendar from "@fullcalendar/vue3";
import {watch} from 'vue';
import {exeGlobalGetLessons, useLesson} from "@/api/useLesson";
import {toCurrency} from "@/stats/Utils";
import moment from "moment";

import {useCalendarLogic} from "@/composables/useCalendarLogic";
import {useLessonForm} from "@/composables/useLessonForm";
import {useTeacherStudentSelection} from "@/composables/useTeacherStudentSelection";

const {TeacherList} = teacherState();
const {StudentList} = studentState();
const {InstrumentList} = instrumentState();
const {RoomList} = roomState();

const {FormEl, formData, getPlans, calculatePrice, resetForm, getPlaningDay} = useLessonForm(InstrumentList);

const {
  cal,
  calendarOptions,
  createFakeLessonInstances,
  addEvent,
  removeEvent,
  updateLessonStartDate
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
  calendarOptions.value.events = []
  exeGlobalGetLessons({})
})

watch(() => formData.value.instrument_id, () => {
  formData.value.instrument_plan = null;
  formData.value.planning = {};
  calendarOptions.value.events = calendarOptions.value.events.filter((event: any) => {
    return event.extendedProps.marker
  })
}, {deep: true})

watch(() => formData.value.instrument_plan, () => {
  formData.value.planning = {};
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
  formData.value.planning = {};
  newVal.map((ev: any) => {
    let day = new Date(ev.start).getDay();
    if (!ev.extendedProps.marker && !ev.extendedProps.fake) {
      if (!formData.value.planning[day]) formData.value.planning[day] = [];
      formData.value.planning[day].push({
        time: new Date(ev.start).toLocaleTimeString(),
        day: day
      })
    }
  })
}, {deep: true})
</script>

<style scoped>
@import '@/styles/lessonCalendar.css';
</style>