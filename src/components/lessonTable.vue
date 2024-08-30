<template>
    <v-data-table :headers="headers" :items="LessonList" item-value="name">
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <td class="_font-black">
              <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.text }}</span>
              <template v-if="isSorted(column)">
                <v-icon :icon="getSortIcon(column)"></v-icon>
              </template>
            </td>
          </template>
        </tr>
      </template>

      <!--   body   -->


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
                    <v-chip :class="schedule.length>1?'!_rounded-2xl first:!_rounded-b-md last:!_rounded-t-md':''">
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
          <v-btn elevation="0" icon="fa-thin fa-calendar _text-sm"
                 size="small" @click="showLessonInstances(item.instances)"></v-btn>
          <v-btn elevation="0" icon="fa-brands fa-apple-pay _text-sm"
                 size="small" @click="showTransactionForm(item)"></v-btn>
        </div>
      </template>

    </v-data-table>
    <v-dialog v-model="toggleDialogInstances" scrollable width="auto">
      <v-card prepend-icon="fa-duotone fa-guitar">
        <template v-slot:title>
          Lesson Instances
        </template>
        <template v-slot:text>
          <LessonInstancesTable :lessonInstances="lessonInstances"/>
        </template>
      </v-card>
    </v-dialog>
    <CreateTransactionDialog :disable-toggle-btn="true"
                             :toggle-transaction-dialog="toggleTransactionDialog"/>

</template>
<script setup lang="ts">

import moment from "moment/moment";
import {toCurrency} from "@/stats/Utils";
import CreateTransactionDialog from "@/views/dashboard/transaction/createTransaction/CreateTransactionDialog.vue";
import LessonInstancesTable from "@/components/lessonInstancesTable.vue";
import {lessonState} from "@/stats/lessonState";
import {ref} from "vue";
import {useEventBus} from "@vueuse/core";

const APP_URL = import.meta.env.VITE_APP_URL;
const {emit} = useEventBus('toggle-transaction-dialog-event');
const toggleDialogInstances = ref(false);
const toggleTransactionDialog = ref(false);
const lessonInstances = ref([]);
const {LessonList} = lessonState();
const headers = [
  {text: 'Instrument', key: 'instrument'},
  {text: 'Teacher', key: 'teacher'},
  {text: 'Planning', key: 'planning'},
  {text: 'Price/Payed price', key: 'price'},
  {text: 'Created', key: 'created_at'},
  {text: 'Actions', key: 'actions', sortable: false},
]
const showLessonInstances = (instances: any) => {
  toggleDialogInstances.value = true;
  lessonInstances.value = instances;
}
const showTransactionForm = (lesson: any) => {
  emit({
    lesson: {...lesson},
  })
}
</script>
