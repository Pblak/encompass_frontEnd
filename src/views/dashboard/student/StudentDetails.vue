<template>
   <div v-if="Student" class="_flex _flex-col _gap-4">
      <v-card>
         <v-list-item>
            <template v-slot:prepend>
               <v-avatar color="primary" size="55">
                  <span class="_text-3xl">{{ Student.name[0] + Student.name[1] }}</span>
                  <!--                  <v-img
                                      alt="John"
                                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                                    ></v-img>-->
               </v-avatar>
            </template>
            
            <template v-slot:title>{{ Student.name }}</template>
            <template v-slot:subtitle>{{ Student.email }}</template>
            
            <template v-slot:append>
               <p class="_font-black _text-gray-600"> Student</p>
            </template>
         </v-list-item>
         <v-divider></v-divider>
         <v-card-text>
            <v-row>
               <v-col cols="6">
                  <p class="text-h6">Phone Numbers</p>
                  <p>{{ Student.infos.phone1 }}</p>
                  <p>{{ Student.infos.phone2 }}</p>
               </v-col>
               <v-col cols="6">
                  <p class="text-h6">Address</p>
                  <p>{{ Student.infos.address.street }}</p>
                  <p>{{ Student.infos.address.city }}, {{ Student.infos.address.state }} {{
                        Student.infos.address.zip
                     }}</p>
               </v-col>
            </v-row>
         </v-card-text>
      </v-card>
      <v-card>
         <v-card-title>
            Lessons
         </v-card-title>
         <v-card-text>
            
            <v-data-table :headers="headers" :items="Lessons" item-value="name">
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
                        <template v-for="(schedule, day) in value">
                           <div class="_flex _flex-col _gap-2">
                              <p class="_font-bold">
                                 {{ moment().day(day).format('dddd') }}
                              </p>
                              <div class="_flex _flex-col _gap-2">
                                 <template v-for="(planning) in schedule">
                                    <v-chip>
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
                        {{ moment(value).format('LLLL') }}
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
                     <LessonInstancesTable :lesson-instances="lessonInstances" />
                  </template>
               </v-card>
            </v-dialog>
            <CreateTransactionDialog :disable-toggle-btn="true"
                                     :toggle-transaction-dialog="toggleTransactionDialog" />
         </v-card-text>
      </v-card>
   </div>
</template>
<script lang="ts" setup>
import {studentState, type StudentType} from "@/stats/studentState";
import {lessonState, LessonType} from "@/stats/lessonState";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import {toCurrency} from "@/stats/Utils";
import moment from "moment";
import LessonInstancesTable from "@/components/lessonInstancesTable.vue";
import CreateTransactionDialog from "@/views/dashboard/transaction/createTransaction/CreateTransactionDialog.vue";
import {useEventBus} from "@vueuse/core";

const route = useRoute();
const student_id = route.params.student_id;
const APP_URL = import.meta.env.VITE_APP_URL;
const {StudentList} = studentState();
const {LessonList} = lessonState();
const toggleTransactionDialog = ref(false);
const toggleDialogInstances = ref(false);
const lessonInstances = ref([]);
const {emit} = useEventBus('toggle-transaction-dialog-event');
const Student: StudentType | undefined = StudentList.value.find((student: StudentType) => student.id === parseInt(student_id as string))
const Lessons = computed<LessonType[]>(() => {
   return LessonList.value.filter((lesson: LessonType) => lesson.student_id === parseInt(student_id as string))
})
const headers = [
   {title: 'Instrument', key: 'instrument'},
   {title: 'Teacher', key: 'teacher'},
   {title: 'Planning', key: 'planning'},
   {title: 'Price/Payed price', key: 'price'},
   {title: 'Created', key: 'created_at'},
   {title: 'Actions', key: 'actions', sortable: false},
]
const showLessonInstances = (instances: any) => {
   toggleDialogInstances.value = true;
   lessonInstances.value = instances;
   console.log(instances)
}
const showTransactionForm = (lesson: any) => {
   emit({
      lesson: {...lesson},
   })
}

</script>
