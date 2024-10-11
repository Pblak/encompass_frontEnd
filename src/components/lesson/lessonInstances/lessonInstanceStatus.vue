<template>
  <template v-for="(status ,i) in lessonInstanceStatus" :key="i">
    <v-chip
        v-if="lessonInstance.status === i"
        :color="status.color" :prepend-icon="status.icon">
      {{ getStatusName() }}
      <v-menu activator="parent" v-if="status.allowTransition.length > 0">
        <v-list>
          <v-list-item v-for="(item, index) in status.allowTransition"
                       :key="index" :value="index"  @click="updateLessonInstanceStatus(item)">
            <template v-slot:prepend>
              <v-icon size="17" :icon="getStatusIcon(item) "></v-icon>
            </template>
            <v-list-item-title >
              {{ getStatusName(item) }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-chip>
  </template>
</template>
<script lang="ts" setup>
import {lessonInstanceStatus} from "@/stats/lessonInstanceState";
import {lessonState} from "@/stats/lessonState";
import {useLessonInstance} from "@/api/useLessonInstance";
import {ref} from "vue";

const {useUpdateLessonInstance} = useLessonInstance();
const {LessonList} = lessonState();
const {
  execute: exeUpdateLessonInstance,
  onResultSuccess: onSuccessUpdateLessonInstance
} = useUpdateLessonInstance()
const {lessonInstance} = defineProps<{
  lessonInstance,
}>();
const selectedStatus = ref(null);
const getStatusName = (status = null) => {
  return lessonInstanceStatus[status ? status : lessonInstance.status].name;
};

const getStatusIcon = (status = null) => {
  return lessonInstanceStatus[status ? status : lessonInstance.status].icon;
};

const updateLessonInstanceStatus = (status) => {
  selectedStatus.value = status
  exeUpdateLessonInstance({
    data: {
      id: lessonInstance.id,
      status: status
    }
  })
};

onSuccessUpdateLessonInstance((res) => {
  for (const k in Object.keys(lessonInstance)) {
    let key = Object.keys(lessonInstance)[k]
    lessonInstance[key] = res.data.data[key]
  }
})
</script>
