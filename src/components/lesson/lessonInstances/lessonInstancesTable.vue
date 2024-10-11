<template>
  <v-data-table :headers="headers" :items="lessonInstances" item-value="name">
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
    <template v-slot:item.start="{ item, value }">
      <div class="_flex _gap-2">
        <v-chip class="!_rounded-r-none"
                color="success">
          {{ moment(value).format('llll') }}
        </v-chip>
        <v-chip class="!_rounded-l-none"
                color="primary">
          {{ moment(value).add( item.duration ,'minutes').format('llll') }}
        </v-chip>
      </div>
    </template>
    <template v-slot:item.duration="{ value }">
      <p>
        {{ value }} Minutes
      </p>
    </template>
    <template v-slot:item.status="{ item,value }">
      <LessonInstanceStatus :lessonInstance="item" />
    </template>

    <template v-slot:item.updated_at="{ value }" >
      <p v-if="value">
        <v-tooltip activator="parent" location="top">
          {{ moment(value).format('LLLL') }}
        </v-tooltip>
        {{ moment(value).format('LLL') }}
      </p>
    </template>
  </v-data-table>
</template>
<script lang="ts" setup>
import moment from "moment/moment";
import LessonInstanceStatus from "@/components/lesson/lessonInstances/lessonInstanceStatus.vue";

const props = defineProps<{
  lessonInstances,
}>();

const headers = [
  {text: 'id', align: 'start', sortable: false, key: 'id',},
  {text: 'Start/End', key: 'start'},
  {text: 'Duration', key: 'duration'},
  {text: 'Room', key: 'room_id'},
  {text: 'Status', key: 'status'},
  {text: 'updated at', key: 'updated_at'},
]
</script>
