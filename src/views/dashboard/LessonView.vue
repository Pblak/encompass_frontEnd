<template>
    <v-card class="_flex-1 !_flex _flex-col">
        <template #title>
            Lessons
        </template>
        <template #append>
            <div class="_flex">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props"
                               size="25"
                               flat
                               icon>
                            <v-icon size="20">fa fa-grip-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item link @click="toggleWithTrash">
                            <template v-slot:prepend>
                                <div class="_pr-2">
                                    <v-switch
                                        :model-value="withTrashLesson"
                                        color="primary"
                                        hide-details></v-switch>
                                </div>
                            </template>
                            <template #title>
                                Show deleted lessons
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </template>
        <v-divider class="border-opacity-75"></v-divider>
        <v-card-text class="_flex-1">
            <LessonTable></LessonTable>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import LessonTable from "@/components/lesson/lessonTable.vue";
import {exeGlobalGetLessons} from "@/api/useLesson.ts";
import {onMounted} from "vue";
import {lessonState} from "@/stats/lessonState";

const {withTrashLesson} = lessonState();
const toggleWithTrash = () => {
    withTrashLesson.value = !withTrashLesson.value;
}

onMounted(() => {
    exeGlobalGetLessons();
});

</script>
