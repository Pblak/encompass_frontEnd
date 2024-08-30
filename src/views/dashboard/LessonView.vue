<template>
  <v-card>
    <v-card-title>
      Lessons
    </v-card-title>
    <v-divider class="border-opacity-75"></v-divider>
    <v-card-text>
      <LessonTable></LessonTable>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import LessonTable from "@/components/lessonTable.vue";
import {exeGlobalGetLessons} from "@/api/useLesson";
import {onMounted} from "vue";

onMounted(() => {
  exeGlobalGetLessons();
});
</script>
