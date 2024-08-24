<template>
   <v-data-table :headers="headers" :items="lessonInstances" item-value="name">
      <template v-slot:item.start="{ item, value }">
         <div class="_flex _gap-2">
            <v-chip class="!_rounded-r-none"
                    color="success">
               {{ moment(value).format('LLL') }}
            </v-chip>
            <v-chip class="!_rounded-l-none"
                    color="primary">
               {{ moment(value).add('minutes', item.duration).format('LLL') }}
            </v-chip>
         </div>
      </template>
      <template v-slot:item.duration="{ value }">
         <p>
            {{ value }} Minutes
         </p>
      </template>
      <template v-slot:item.status="{ value }">
         <v-chip v-if="value === 'scheduled'"
                 color="primary"
                 prepend-icon="fa-duotone fa-calendar-days">{{ value }}
         </v-chip>
         <v-chip v-else-if="value === 'in_progress'"
                 color="primary"
                 prepend-icon="fa-duotone fa-hourglass-start fa-beat-fade">{{ value }}
         </v-chip>
         <v-chip v-else-if="value === 'completed'"
                 color="primary"
                 prepend-icon="fa-duotone fa-check">{{ value }}
         </v-chip>
         <v-chip v-else
                 color="error"
                 prepend-icon="fa-duotone fa-hexagon-xmark">{{ value }}
         </v-chip>
      </template>
      <template v-slot:item.created_at="{ value }">
         <p>
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

const props = defineProps<{
   lessonInstances,
   headers?:object,
}>();

const headers =  [
   {title: 'id', align: 'start', sortable: false, key: 'id',},
   {title: 'Start/End', key: 'start'},
   {title: 'Duration', key: 'duration'},
   {title:'Room', key:'room_id'},
   {title: 'Status', key: 'status'},
]
</script>