<template>
    <div v-if="Parent" class="_flex _flex-col _gap-4">
        <v-card>
            <template v-slot:title>
                <template v-if="Parent">
                    <v-chip color="primary" class="text-capitalize">Parent</v-chip>
                </template>

            </template>
            <template v-slot:append>
                <div class="_flex _gap-2 _items-center">
                    <UpdateParentDialog :parent-selected="Parent"/>
                </div>
            </template>
            <v-list-item>
                <template v-slot:prepend>
                    <v-avatar color="primary" size="55">
                        <v-img alt="John" :src="APP_URL+Parent.infos.avatar" ></v-img>
                    </v-avatar>
                </template>

                <template v-slot:title>{{ Parent.name }}</template>
                <template v-slot:subtitle>{{ Parent.email }}</template>
            </v-list-item>
            <v-divider></v-divider>
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <p class="text-h6">Phone Numbers</p>
                        <p>{{ Parent.infos.phone1 }}</p>
                        <p>{{ Parent.infos.phone2 }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p class="text-h6">Address</p>
                        <p>{{ Parent.infos.address.street }}</p>
                        <p>{{ Parent.infos.address.city }}, {{ Parent.infos.address.state }} {{
                                Parent.infos.address.zip
                            }}</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card>
        </v-card>
    </div>
</template>
<script lang="ts" setup>
import {parentState, type ParentType} from "@/stats/parentState";
import {lessonState, LessonType} from "@/stats/lessonState";
import {computed, ComputedRef, ref} from "vue";
import {useRoute} from "vue-router";
import {useEventBus} from "@vueuse/core";
import UpdateParentDialog from "@/views/dashboard/parent/ParentDialog/UpdateParentDialog.vue";
import type {StudentType} from "@/stats/studentState";


const {emit} = useEventBus('toggle-transaction-dialog-event');
const route = useRoute();
const parent_id = route.params.parent_id;
const APP_URL = import.meta.env.VITE_APP_URL;
const {ParentList} = parentState();
// const {LessonList} = lessonState();
// const toggleDialogInstances = ref(false);
// const lessonInstances = ref([]);
const Parent:ComputedRef<ParentType | undefined> = computed(() => {
  return ParentList.value.find((parent: ParentType) => parent.id === parseInt(parent_id as string))
})

const headers = [
    {title: 'Instrument', key: 'instrument'},
    {title: 'Teacher', key: 'teacher'},
    {title: 'Planning', key: 'planning'},
    {title: 'Price/Payed price', key: 'price'},
    {title: 'Created', key: 'created_at'},
    {title: 'Actions', key: 'actions', sortable: false},
]
// const editParent = () => {
//     console.log('edit parent')
// }

</script>
