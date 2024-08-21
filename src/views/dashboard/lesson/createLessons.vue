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
          <v-col cols="12" lg="3" md="3" sm="6">
            <v-select v-model="formData.teacher_id" :items="TeacherList"
                      :rules="$rules('required|number' ,'Teacher')" density="compact" item-title="name"
                      item-value="id"
                      label="Teacher" variant="solo"></v-select>
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="6">
            <v-select v-model="formData.student_id" :items="StudentList"
                      :rules="$rules('required|number' ,'Student')" density="compact" item-title="name"
                      item-value="id"
                      label="Student" variant="solo"></v-select>
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="6" v-if="InstrumentList">

            <v-select v-model="formData.instrument_id" :items="InstrumentList"
                      :rules="$rules('required|number' ,'Instrument')" density="compact" item-title="name"
                      item-value="id"
                      label="Instrument" variant="solo"></v-select>
          </v-col>
          <v-col cols="12" lg="3" md="3" sm="6">
            <v-select v-model="formData.room_id" :items="RoomList"
                      :rules="$rules('required|number' ,'Room')" density="compact" item-title="name"
                      item-value="id"
                      label="Room" variant="solo"></v-select>
          </v-col>
          <v-col cols="12" lg="4" md="4" sm="12">
            <v-row>
              <v-col cols="12" lg="6" sm="6">
                <v-text-field v-model="formData.frequency"
                              :rules="$rules('required|number' ,'Duration')" density="compact" label="Frequency"
                              variant="solo">
                  <v-tooltip slot="append" activator="parent" location="bottom">
                    How many times the planing will repeat
                  </v-tooltip>
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="6" sm="6">
                <v-select v-model="formData.instrument_plan" :items="getPlans" :rules="$rules('object' ,'Plan')"
                          density="compact" item-title="name" item-value="id"
                          label="Plan"
                          return-object variant="solo"></v-select>
              </v-col>
              <v-col>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-card>
                      <v-card-item>
                        <v-card-title>
                          Start date
                        </v-card-title>
                        <v-card-subtitle>
                          {{ moment(formData.start_date).format('LLL') }}
                        </v-card-subtitle>
                        <template v-slot:append>
                          <v-btn :icon="true" density="compact" v-bind="props">
                            <v-icon size="14">fa fa-calendar</v-icon>
                          </v-btn>
                        </template>
                      </v-card-item>
                    </v-card>
                  </template>
                  <v-date-picker
                      :min="moment().add(1, 'days').add('6','hours').format('YYYY-MM-DD')"
                      @update:model-value="(ev)=>formData.start_date = moment(ev as string).add('8','hours')
                             .toISOString()"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col v-if="formData.instrument_plan" cols="12">
                <v-card :title="formData.instrument_plan.name" subtitle="These values are for each lesson">
                  <v-card-text>
                    <v-list>
                      <v-list-item title="Price ">
                        <template v-slot:append>
                          <v-chip color="green">
                            {{ toCurrency(formData.instrument_plan.price) }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      <v-list-item title="Duration ">
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
                               color="success" inline>
                      </v-badge>
                      {{ i }}
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
import {useLesson, exeGlobalGetLessons} from "@/api/useLesson";
import {computed, ref, watch} from 'vue';
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from "moment";
import {toCurrency} from "@/stats/Utils";

interface planning {
  [key: number]: Array<{
    time: string,
    day: number
  }>
}

const {TeacherList} = teacherState();
const {StudentList} = studentState();
const {InstrumentList} = instrumentState();
const {RoomList} = roomState();
const FormEl = ref(null);
const {useCreateLesson} = useLesson()
const {
  execute: exeCreateLesson,
  onResultSuccess: onResultSuccessCreateLesson,
} = useCreateLesson();
const formData = ref({
  teacher_id: '',
  student_id: '',
  instrument_id: '',
  room_id: '',
  planning: {} as planning,
  frequency: 1,
  start_date: moment().add('8', 'hours').toISOString(),
  instrument_plan: "" as any,
  price: 0,
  active: 1,
  notes: ''
})
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: '',
    center: '',
    right: '',
  },
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: false,
    meridiem: 'short'
  },
  dayHeaderFormat: {
    weekday: 'short'
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '18:00:00',
  selectable: true,
  select: (info: any) => {
    addEvent(info)
  },
  events: [],
  eventClick: (info: any) => {
    removeEvent(info)
  }
})
const removeEvent = (info: any) => {
  // remove event from calendar
  calendarOptions.value.events = calendarOptions.value.events.filter((ev: any) => {
    return !moment(ev.start).isSame(info.event.start)
  })
}
const addEvent = (info: any) => {
  let day = moment(info.start).day();
  let time = moment(info.start).format('HH:mm:ss');
  // limit 3 events per day
  if ((formData.value.planning[day] && formData.value.planning[day].length >= 2) || !formData.value.instrument_plan) {
    return;
  }
  let duration = formData.value.instrument_plan?.duration ? formData.value.instrument_plan?.duration : 30;
  // remove event from calendar if there is an event at the same time or plus the duration

  let p = calendarOptions.value.events.filter((ev: any) => {
    let evDay = moment(ev.start).day();
    let evTime = moment(ev.start).format('HH:mm:ss');

    return !(evDay === day &&
        (evTime === time || evTime <= moment(info.start).add(duration, 'minutes').format('HH:mm:ss') ||
            evTime === moment(info.start).subtract(duration, 'minutes').format('HH:mm:ss'))
    )
  })
  p.push({
    title: '--',
    start: info.start,
    end: moment(info.start).add(formData.value.instrument_plan?.duration, 'minutes').toISOString(),
    allDay: info.allDay
  } as never)
  calendarOptions.value.events = p;
}
const getPlaningDay = (i: string) => {
  let day = formData.value.planning[parseInt(moment().day(i).format('d'))]
  return day ? day : []
}

const getPlans = computed(() => {
  if (!formData.value.instrument_id) return []
  return InstrumentList.value.find((res: any) => res.id === formData.value.instrument_id)?.plans
})
const calculatePrice = () => {
  if (!formData.value.instrument_plan) return 0;
  let total = Object.values(formData.value.planning).reduce((acc, val) => {
    return acc + val.length
  }, 0)
  formData.value.price = total * parseInt(formData.value.instrument_plan?.price) * formData.value.frequency
  return toCurrency(formData.value.price)
}
const save = async () => {
  // save the lesson
  if (!FormEl.value) return;
  let {valid} = await (FormEl.value as any).validate()
  if (!valid) return;
  await exeCreateLesson({
    data: formData.value
  })
}
onResultSuccessCreateLesson(() => {
  // clear the form
  if (FormEl.value) (FormEl.value as any).reset();
  formData.value = {
    teacher_id: '',
    student_id: '',
    instrument_id: '',
    room_id: '',
    planning: {} as planning,
    frequency: 1,
    instrument_plan: "" as any,
    start_date: moment().add('8', 'hours').toISOString(),
    price: 0,
    active: 1,
    notes: ''
  }
  calendarOptions.value.events = []
  exeGlobalGetLessons()
})

watch(() => formData.value.instrument_id, () => {
  formData.value.instrument_plan = null;
  formData.value.planning = {} as planning;
  calendarOptions.value.events = []
}, {deep: true})

watch(() => formData.value.instrument_plan, () => {
  formData.value.planning = {} as planning;
  calendarOptions.value.events = []
}, {deep: true})

watch(
    () => calendarOptions.value.events,
    (newVal) => {
      formData.value.planning = {} as planning;
      newVal.map((ev: any) => {
        let day = new Date(ev.start).getDay();
        if (!formData.value.planning[day]) formData.value.planning[day] = [];
        formData.value.planning[day].push({
          time: new Date(ev.start).toLocaleTimeString(),
          day: day
        })
      })

    }, {deep: true})

</script>
