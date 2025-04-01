<template>
  <div v-if="Teacher" class="_flex _flex-col _gap-4">
    <v-card>
      <template v-slot:title>
        <template v-if="Teacher">
          <v-chip color="primary" class="text-capitalize">Teacher</v-chip>
        </template>

      </template>
      <template v-slot:append>
        <div class="_flex _gap-2 _items-center">
          <UpdateTeacherDialog
              :selected-teacher="Teacher"/>
        </div>
      </template>
      <v-list-item>

        <template v-slot:prepend>
          <v-avatar color="primary" size="55">
            <v-img v-if="Teacher.infos.avatar" alt="John"
                   :src="APP_URL+Teacher.infos.avatar"></v-img>
            <span v-else class="_text-2xl">
                {{ Teacher.name.slice(0, 2) }}
            </span>
          </v-avatar>
        </template>

        <template v-slot:title>{{ Teacher.name }}</template>
        <template v-slot:subtitle>{{ Teacher.email }}</template>
      </v-list-item>

      <v-divider></v-divider>
      <v-card-text>

        <v-row>
          <v-col cols="6">
            <p class="text-h6">Phone Numbers</p>
            <p>{{ Teacher.infos.phone1 }}</p>
            <p>{{ Teacher.infos.phone2 }}</p>
          </v-col>
          <v-col cols="6">
            <p class="text-h6">Address</p>
            <p>{{ Teacher.infos.address.street }}</p>
            <p>{{ Teacher.infos.address.city }}, {{ Teacher.infos.address.state }} {{
                Teacher.infos.address.zip
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
                <template v-for="(schedule, day) in value" :key="day">
                  <div class="_flex _flex-col _gap-2">
                    <p class="_font-bold">
                      {{ moment().day(day).format('dddd') }}
                    </p>
                    <div class="_flex _flex-col _gap-2">
                      <template v-for="(planning) in schedule" :key="planning.id">
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
              <!--              <v-btn elevation="0" icon="fa-brands fa-apple-pay _text-sm"-->
              <!--                     size="small" @click="showTransactionForm(item)"></v-btn>-->
            </div>
          </template>

        </v-data-table>

        <v-dialog v-model="toggleDialogInstances" scrollable width="auto">
          <v-card prepend-icon="fa-duotone fa-guitar">
            <template v-slot:title>
              Lesson Instances
            </template>
            <template v-slot:text>
              <LessonInstancesTable :lesson-instances="lessonInstances"/>
            </template>
          </v-card>
        </v-dialog>
        <CreateTransactionDialog :disable-toggle-btn="true"
                                 :toggle-transaction-dialog="toggleTransactionDialog"/>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts" setup>
import {teacherState, type TeacherType} from "@/stats/teacherState";
import {lessonState, LessonType} from "@/stats/lessonState";
import {useLesson} from "@/api/useLesson";
import {computed, ComputedRef, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {toCurrency} from "@/stats/Utils";
import {useEventBus} from "@vueuse/core";
import moment from "moment";
import LessonInstancesTable from "@/components/lesson/lessonInstances/lessonInstancesTable.vue";
import CreateTransactionDialog from "@/views/dashboard/transaction/createTransaction/CreateTransactionDialog.vue";
import UpdateTeacherDialog from "@/views/dashboard/teacher/TeacherDialog/UpdateTeacherDialog.vue";


const {emit} = useEventBus('toggle-transaction-dialog-event');
const route = useRoute();
const teacher_id = route.params.teacher_id;
const APP_URL = import.meta.env.VITE_APP_URL;
const {TeacherList} = teacherState();
const {useGetLessons} = useLesson();

const {
  execute: exeGetLessons,
  onResultSuccess: onGetLessonsSuccess
} = useGetLessons();
const toggleTransactionDialog = ref(false);
const toggleDialogInstances = ref(false);
const lessonInstances = ref([]);

const Teacher: ComputedRef<TeacherType | undefined> = computed(() => {
  return TeacherList.value.find((teacher: TeacherType) => teacher.id === parseInt(teacher_id as string))
})

const LessonList = ref<LessonType[]>([])
const Lessons = computed<LessonType[]>(() => {
  return LessonList.value.filter((lesson: LessonType) => lesson.teacher_id === parseInt(teacher_id as string))
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
}
const showTransactionForm = (lesson: any) => {
  emit({
    lesson: {...lesson},
  })
}

const editTeacher = () => {
  console.log('edit teacher')
}

onMounted(() => {
  exeGetLessons({
    subject: "teachers",
    id: teacher_id
  })
})
onGetLessonsSuccess((res) => {
  LessonList.value = res.data;
})
</script>
