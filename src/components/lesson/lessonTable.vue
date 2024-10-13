<template>
    <v-data-table :headers="headers" :items="LessonList" height="calc(100vh - 12rem)" fixed-header
                  item-value="name">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr class="_bg-white ">
                <template v-for="column in columns" :key="column.key">
                    <td class="_font-black">
              <span class="mr-2 cursor-pointer"
                    @click="() => toggleSort(column)">{{ column.text }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>
                    </td>
                </template>
            </tr>
        </template>
        <!-- body -->
        <template #item.instrument="{item , value}">
            <v-list>
                <v-list-item class="!_px-1">
                    <template #prepend>
                        <v-avatar rounded="sm" size="30">
                            <v-img :src="APP_URL+value.image" class="_p-2"></v-img>
                        </v-avatar>
                    </template>
                    <v-list-item-title>
                        {{ value.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ item.instrument_plan.name }}
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </template>

        <template #item.teacher="{value}">
            {{ value.name }}
        </template>

        <template #item.planning="{value}">
            <div class="overflow-x-auto _max-w-screen-sm">
                <div class="_flex  _gap-3 _py-2">
                    <template v-for="(schedule, day) in value" :key="day">
                        <div class="_flex _flex-col _gap-2">
                            <p class="_font-bold">
                                {{ moment().day(day).format('dddd') }}
                            </p>
                            <div class="_flex _flex-col _gap-1">
                                <template v-for="(planning) in schedule" :key="planning.id">
                                    <v-chip
                                        :class="schedule.length>1?'!_rounded-2xl first:!_rounded-b-md last:!_rounded-t-md':''">
                                        {{ planning.time }}
                                    </v-chip>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>

        <template v-slot:item.price="{ item,value }">
            <div class="_flex _gap-1">
                <v-chip class="!_rounded-r-none"
                        color="primary">{{ toCurrency(value) }}
                </v-chip>
                <v-chip class="!_rounded-l-none"
                        color="success">{{ toCurrency(item.payed_price) }}
                </v-chip>

            </div>
        </template>

        <template v-slot:item.created_at="{ value }">
            <p>
                <v-tooltip activator="parent" location="top">
                    {{ moment(value).format('lll') }}
                </v-tooltip>
                {{ moment(value).format('LLL') }}
            </p>
        </template>

        <template v-slot:item.actions="{ item }">
            <div class="_flex _gap-3 ">

                <v-btn elevation="0" icon="fa-thin fa-calendar _text-sm" color="primary" variant="tonal"
                       size="small" @click="showLessonInstances(item.id)"></v-btn>

                <v-btn elevation="0" icon="fa-brands fa-apple-pay _text-sm" color="green" variant="tonal"
                       size="small" @click="showTransactionForm(item)"></v-btn>

                <v-btn elevation="0" icon="fa-thin fa-trash _text-sm" v-if="item.deleted_at == null"
                       @click="openDeleteDialog(item)" color="red" variant="tonal" size="small"></v-btn>

            </div>
        </template>
    </v-data-table>

    <v-dialog v-model="toggleDialogInstances" scrollable width="auto">
        <v-card prepend-icon="fa-duotone fa-guitar" :loading="loadingDialogInstances">
            <template v-slot:title>
                Lesson Instances
            </template>
            <template v-slot:text>
                <LessonInstancesTable :lessonInstances="lessonInstances"
                                      :set-loading="setLoadingDialogInstances" />
            </template>
        </v-card>
    </v-dialog>

    <v-dialog v-model="toggleDeleteDialog" scrollable width="auto">
        <v-card prepend-icon="fa-duotone fa-guitar">
            <template v-slot:title>
                Delete Lesson
            </template>
            <template v-slot:text>
                <v-alert type="error" variant="tonal">
                    Are you sure you want to delete this lesson ?
                </v-alert>
            </template>
            <template v-slot:actions>
                <v-btn color="success" @click="deleteLesson" variant="tonal">
                    confirm
                </v-btn>
            </template>
        </v-card>
    </v-dialog>

    <CreateTransactionDialog :disable-toggle-btn="true" :toggle-transaction-dialog="toggleTransactionDialog"/>

</template>
<script setup lang="ts">

import moment from "moment/moment";
import {toCurrency} from "@/stats/Utils";
import CreateTransactionDialog from "@/views/dashboard/transaction/createTransaction/CreateTransactionDialog.vue";
import LessonInstancesTable from "@/components/lesson/lessonInstances/lessonInstancesTable.vue";
import {lessonState, LessonType} from "@/stats/lessonState";
import {exeGlobalGetLessons, useLesson} from "@/api/useLesson";
import {ref, watch} from "vue";
import {useEventBus} from "@vueuse/core";
import type {LessonInstanceType} from "@/stats/lessonInstanceState";

const APP_URL = import.meta.env.VITE_APP_URL;
const {emit} = useEventBus('toggle-transaction-dialog-event');
const {useDeleteLesson} = useLesson();
const toggleDialogInstances = ref(false);
const toggleTransactionDialog = ref(false);
const {LessonList} = lessonState();
const lessonInstances = ref<LessonInstanceType[]>([])
const toggleDeleteDialog = ref(false);
const selectedDeleteLesson = ref<LessonType>();
const loadingDialogInstances = ref<boolean>(false);
const setLoadingDialogInstances =(res:boolean)=>{
    loadingDialogInstances.value = res;
}
const {
    execute: exeDeleteLesson,
    onResultSuccess: onResultSuccessDeleteLesson,
} = useDeleteLesson();
const headers = [
    {text: 'Instrument', key: 'instrument'},
    {text: 'Student', key: 'student.name'},
    {text: 'Teacher', key: 'teacher'},
    {text: 'Planning', key: 'planning'},
    {text: 'Price/Payed price', key: 'price'},
    {text: 'Created', key: 'created_at'},
    {text: 'Actions', key: 'actions', sortable: false},
]

const openDeleteDialog = (lesson: LessonType) => {
    toggleDeleteDialog.value = true;
    selectedDeleteLesson.value = lesson;
}

const deleteLesson = async () => {
    if (selectedDeleteLesson.value) {
        await exeDeleteLesson({
                data: {
                    id: selectedDeleteLesson.value.id
                }
            }
        );
    }
}
onResultSuccessDeleteLesson(() => {
    toggleDeleteDialog.value = false;
    selectedDeleteLesson.value = undefined;
    exeGlobalGetLessons();
})
const showLessonInstances = (lesson_id:number) => {
    toggleDialogInstances.value = true;
    lessonInstances.value = LessonList.value.find((lesson: LessonType) => lesson.id === lesson_id)?.instances || [];
}
const showTransactionForm = (lesson: any) => {
    emit({
        lesson: {...lesson},
    })
}
watch(()=>LessonList.value,()=>{
    if (lessonInstances.value.length > 0) {
        lessonInstances.value = LessonList.value.find((lesson: LessonType) => lesson.id === lessonInstances.value[0].lesson_id)?.instances || [];
    }
})

</script>
