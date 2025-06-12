<script lang="ts" setup>
import {useLesson} from "@/api/useLesson";
import {lessonState} from "@/stats/lessonState";
import {onMounted} from "vue";

const {useGetLessons} = useLesson();
const {LessonList} = lessonState()
const {
  execute: exeGetLessons,
  onResultSuccess: onGetLessonsSuccess,
} = useGetLessons();

onMounted(() => {
  window.Echo.channel('lesson-instance')
      .listen('LessonInstanceStatusUpdatedEvent',
          (event: any) => {
            console.log('Lesson instance status updated:', event);
            exeGetLessons({})
            // Update your Vue component state or perform actions based on the event
          });
});
onGetLessonsSuccess((res: any) => {
  LessonList.value = res.data
})

</script>

<template>
  <RouterView/>
</template>