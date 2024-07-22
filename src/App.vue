<script lang="ts" setup>
import {onMounted} from "vue";
import {useLesson} from "@/api/useLesson";
import {lessonState} from "@/stats/lessonState";

const {useGetLessons} = useLesson();
const {LessonList} = lessonState()
const {
   execute: exeGetLessons,
   onResultSuccess: onGetLessonsSuccess,
} = useGetLessons();

onMounted(() => {
   console.log(window.Echo);
   window.Echo.channel('lesson-instance')
     .listen('LessonInstanceStatusUpdatedEvent',
       (event: any) => {
          console.log('Lesson instance status updated:', event);
          exeGetLessons()
          // Update your Vue component state or perform actions based on the event
       });
});
onGetLessonsSuccess((res: any) => {
   LessonList.value = res.data
   console.log(LessonList.value)
})

</script>

<template>
   <RouterView/>
</template>

