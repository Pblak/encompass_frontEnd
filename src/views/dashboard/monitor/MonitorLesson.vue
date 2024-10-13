<template>
    <v-row>
        <v-col cols="12" md="4">
            <v-row>
                <v-col cols="12">
                    <v-card class="">
                        <v-card-title>
                            Lessons
                            <!--                     <v-text-field v-model="searchLesson" density="comfortable" flat hide-details-->
                            <!--                                   label="Lessons" variant="outlined"></v-text-field>-->
                        </v-card-title>
                        <v-card-text class="_bg-gray-100 overflow-y-auto _h-[calc(100vh-5.5rem)] !_pt-4">
                            <v-row>
                                <v-col v-for="lesson in LessonList" :key="lesson.id" cols="12">
                                    <v-card>
                                        <v-card-item prepend-avatar="https://cdn.vuetifyjs.com/images/cards/foster.jpg">
                                            <v-card-title class="!_font-black !_text-sm !_text-md">
                                                {{ lesson.student.name }}
                                            </v-card-title>
                                            <v-card-subtitle class="!_text-xs">{{
                                                    lesson.student.email
                                                }}
                                            </v-card-subtitle>
                                            <template v-slot:append>
                                                <v-checkbox v-model="LessonsSelected" :value="lesson.id"
                                                            hide-details></v-checkbox>
                                            </template>

                                        </v-card-item>
                                        <v-divider class="_border-gray-800"></v-divider>
                                        <v-card-text class="!_px-0 !_pb-1">
                                            <VList class=" ">
                                                <v-list-item :append-avatar="APP_URL+lesson.instrument.image">
                                                    <v-list-item-title>Instrument</v-list-item-title>
                                                    <v-list-item-subtitle class="!_capitalize">
                                                        {{ lesson.instrument.name }}
                                                    </v-list-item-subtitle>
                                                    <template #append>
                                                        <v-avatar rounded="sm">
                                                            <v-img :src="APP_URL+lesson.instrument.image"></v-img>
                                                        </v-avatar>

                                                    </template>
                                                </v-list-item>
                                                <v-list-item>
                                                    <template v-slot:append>
                                                        <div class="_flex _flex-col ">
                                                            <v-list-item-title>
                                                                Payed price
                                                            </v-list-item-title>
                                                            <v-chip density="compact" color="success">
                                                                {{ toCurrency(lesson.payed_price) }}
                                                            </v-chip>
                                                        </div>
                                                    </template>
                                                    <v-list-item-title>
                                                        Lesson price
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        <v-chip density="compact" color="primary">
                                                            {{ toCurrency(lesson.price) }}
                                                        </v-chip>
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
                                                                !planningsContainers.includes(`${lesson.id}_planning` as never) ?
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
                                                        <v-row class="_px-2">
                                                            <v-col
                                                                v-for="day in Object.keys(transformDataToDays(lesson.planning))"
                                                                :key="day"
                                                                cols="4">
                                                                <div class="_flex _flex-col _gap-4">
                                                                    <span class="_capitalize _font-bold _text-xs">{{
                                                                            day
                                                                        }}</span>
                                                                    <v-chip
                                                                        v-for="item in transformDataToDays(lesson.planning)[day]"
                                                                        :key="item.id"
                                                                        color="secondary">
                                       <span class="_text-xs">
                                          {{ moment(item.time, 'h:mm:ss A').format('hh:mm A') }}
                                       </span>
                                                                    </v-chip>
                                                                    <div
                                                                        v-if="transformDataToDays(lesson.planning)[day].length === 0"
                                                                        class="_text-center">
                                                                        <span
                                                                            class="_text-xs _text-gray-400">----</span>
                                                                    </div>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-expansion-panel-text>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                        </v-card-text>
                                        <v-divider class="_border-gray-800"></v-divider>
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
                    <v-card class="">
                        <v-card-text>
                            <FullCalendar ref="cal" :options="calendarOptions as CalendarOptions"/>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>


        </v-col>
    </v-row>
    <v-dialog v-model="calDialog" width="auto">
        <v-card density="compact" :loading="calDialogLoading">
            <!--            <v-tabs v-model="calDialogTabs">-->
            <!--                <v-tab :value="1">create Event</v-tab>-->
            <!--                <v-tab :value="2">Item Two</v-tab>-->
            <!--                <v-tab :value="3">Item Three</v-tab>-->
            <!--            </v-tabs>-->
            <v-card-text class="!_p-0">
                <v-tabs-window v-model="calDialogTabs" class="_p-4">
                    <v-tabs-window-item :value="1">
                        <!-- create event form-->
                        <!--                        <create-event-form></create-event-form>-->
                    </v-tabs-window-item>

                    <v-tabs-window-item :value="2">
                        <div class="_flex _flex-col _gap-2">
                            <v-card flat>
                                <v-card-title>
                                    Lesson
                                </v-card-title>
                                <v-card-text>
                                    <v-list class="!_flex">
                                        <v-list-item>
                                            <v-list-item-title>
                                                Student
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ selectedLesson?.student.name }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>
                                                Instrument
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ selectedLesson?.instrument.name }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>
                                                Teacher
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ selectedLesson?.teacher.name }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>
                                                Payed price
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ toCurrency(selectedLesson?.payed_price) }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>
                                                Lesson price
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ toCurrency(selectedLesson?.price) }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                    </v-list>

                                </v-card-text>
                            </v-card>

                        <v-divider class="_border-gray-400"></v-divider>
                        <LessonInstancesTable hide-default-footer
                                              :lessonInstances="[selectedInstance as LessonInstanceType]"
                                              :lesson="selectedLesson"
                                              :loading="calDialogLoading"
                                              :setLoading="getCalDialogLoading"/>
                        </div>


                    </v-tabs-window-item>

                    <v-tabs-window-item :value="3">
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
// import {calendarState} from '@/stats/calendarState'
import {lessonState, type LessonType} from '@/stats/lessonState'
import {lessonInstanceStatus, type LessonInstanceType} from '@/stats/lessonInstanceState'
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {exeGlobalGetLessons, useLesson} from "@/api/useLesson";
import {toCurrency} from "@/stats/Utils";
import {CalendarOptions} from "@fullcalendar/core";
import LessonInstancesTable from "@/components/lesson/lessonInstances/lessonInstancesTable.vue";

const APP_URL = import.meta.env.VITE_APP_URL;
const cal = ref(null)
const calDialog = ref(false)
const calDialogTabs = ref<number>(1)
const calDialogLoading = ref<boolean>(false)
const getCalDialogLoading = (val) => {
    calDialogLoading.value = val
}
const selectedInstance = ref<LessonInstanceType>()
const selectedLesson = ref<LessonType>()
// const searchLesson = ref('')
// const {rangeSelected} = calendarState()
const {LessonList, LessonsSelected} = lessonState()
const {useGetLessons} = useLesson();
// const {
//     execute: exeGetLessons,
//     onResultSuccess: onGetLessonsSuccess,
// } = useGetLessons()

const calendarOptions = reactive({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    themeSystem: 'Lumen',
    events: [],
    eventClick: (info: any) => {
        calDialog.value = true
        calDialogTabs.value = 2
        selectedLesson.value = LessonList.value.find((lesson: any) => lesson.id === info.event.extendedProps.lessonId) as LessonType

        selectedInstance.value = selectedLesson.value!.instances
            .find((instance: LessonInstanceType) => {
                return instance.id === info.event.extendedProps.instanceId
            }) as LessonInstanceType

    },
})
const transformDataToDays = (planningData: any) => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const transformedData: { [key: string]: any[] } = {};
    daysOfWeek.forEach((day: string) => {
        transformedData[day] = [];
    });
    for (const day in planningData) {
        if (Object.prototype.hasOwnProperty.call(planningData, day)) {
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
    const events = selectedLessons.map((lesson: LessonType) => {
        let instances = lesson.instances.map((instance: any) => {
            return {
                title: lesson.student.name + ' | ' + lesson.instrument.name,
                start: instance.start,
                end: moment(instance.start).add(instance.duration, 'minutes')
                    .format('YYYY-MM-DD HH:mm:ss'),
                extendedProps: {
                    lessonId: lesson.id,
                    instanceId: instance.id,
                    status: instance.status,
                    start: instance.start
                },
                // color: instance.status === 'scheduled' ? '#0b6ab9' : instance.status === 'in_progress' ? 'yellow' : instance.status === 'completed' ? 'green' : 'red',
                color: lessonInstanceStatus[instance.status].color,
            }
        })
        return flatten(instances)
    })
    calendarOptions.events = flatten(events)
}

const lessonsInstrument = computed(() => {
    let instruments = LessonList.value.map((lesson: any) => lesson.instrument).filter((obj, index, self) =>
        index === self.findIndex((t) => t.id === obj.id)
    )

    // make it unique
    return [...new Set(instruments)]
})

onMounted(() => {
    exeGlobalGetLessons()
    renderEvent()
})

watch(() => LessonsSelected.value, () => {
    renderEvent()
}, {deep: true})

watch(() => LessonList.value, () => {
    renderEvent()

    if (selectedLesson.value) {
        selectedLesson.value = LessonList.value
            .find((lesson: LessonType) => {
                return lesson.id === selectedLesson.value!.id
            }) as LessonType
    }

    if (selectedInstance.value) {
        selectedInstance.value = LessonList.value
            .find((lesson: LessonType) => {
                return lesson.id === selectedLesson.value!.id
            })!.instances
            .find((instance: LessonInstanceType) => {
                return instance.id === selectedInstance.value!.id
            }) as LessonInstanceType
    }
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
