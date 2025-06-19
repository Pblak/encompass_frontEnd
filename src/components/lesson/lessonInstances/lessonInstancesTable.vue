<template>
    <v-data-table :headers="headers" :items="lessonInstances" item-value="name">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
                <template v-for="column in columns" :key="column.key">
                    <td class="_capitalize">
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>
                    </td>
                </template>
            </tr>
        </template>

        <!--   body   -->
        <template v-slot:item.start="{ item, value }">
            <div class="_flex _gap-2 _flex-col _py-1">
                <v-chip class="!_rounded-2xl !_rounded-b-md"
                        color="success">
                    {{ moment(value).format('llll') }}
                </v-chip>
                <v-chip class="!_rounded-2xl !_rounded-t-md"
                        color="primary">
                    {{ moment(value).add(item.duration, 'minutes').format('llll') }}
                </v-chip>
            </div>
        </template>
        <template v-slot:item.duration="{ value }">
            <p>
                {{ value }} Minutes
            </p>
        </template>
        <template v-slot:item.room_id="{ value }">
            <p>
                {{ getRoomName(value) }}
            </p>
        </template>
        <template v-slot:item.teacher="{ item }">
            <div class="_flex _flex-col _gap-4">
                <div class="_flex _gap-2 _items-center _cursor-pointer _py-1" @dblclick="()=>item.dbClick= !item.dbClick">
                    <b>
                        {{ item.teacher_id ? 'Instance' : 'Default' }}:
                    </b>
                    <p>
                        {{ item.teacher.name }}
                    </p>
                    <v-btn v-if="instancesToRecycle[item.id] && instancesToRecycle[item.id].hasOwnProperty('teacher_id')"
                           @click="attemptRecycle(item.id)"
                           icon rounded="md" variant="tonal" size="30" color="primary" flat>
                        <VIcon size="20">fa fa-recycle</VIcon>
                    </v-btn>
                </div>

                <v-select v-if="item.dbClick"
                    :loading="selectedTeachers[item.id]?.loading"
                    label="Select"
                    variant="underlined"
                    density="comfortable"
                    v-model="selectedTeachers[item.id]"
                    :items="TeacherList"
                    return-object
                    item-title="name"
                    @update:model-value="(selected) => updateLessonInstanceTeacher(item, selected.id)">
                    <template v-slot:item="{ props, item: propsItem }">
                        <!-- Rename the item here -->
                        <v-list-item v-bind="props" :subtitle="propsItem.raw.email"></v-list-item>
                        <!-- Use propsItem -->
                    </template>
                </v-select>
            </div>
        </template>
        <template v-slot:item.status="{ item }">
            <LessonInstanceStatus :lessonInstance="item"/>
        </template>

        <template v-slot:item.updated_at="{ value }">
            <p v-if="value">
                <v-tooltip activator="parent" location="top">
                    {{ moment(value).format('LLLL') }}
                </v-tooltip>
                {{ moment(value).format('l') }}
            </p>
        </template>
    </v-data-table>

</template>
<script lang="ts" setup>
import moment from "moment/moment";
import LessonInstanceStatus from "@/components/lesson/lessonInstances/lessonInstanceStatus.vue";
import type {LessonInstanceType} from "@/stats/lessonInstanceState";
import {lessonState, type LessonType} from "@/stats/lessonState";
import {roomState} from "@/stats/roomState";
import {exeGlobalGetLessons} from "@/api/useLesson";
import {teacherState, type TeacherType} from "@/stats/teacherState";
import {computed, ref} from "vue";
import {useLessonInstance} from "@/api/useLessonInstance";

const props = defineProps<{
    lessonInstances: LessonInstanceType[],
    lesson?: LessonType
    setLoading?: (val: boolean) => void
    loading?: boolean
}>();
const {useUpdateLessonInstance} = useLessonInstance();
const {
    execute: exeUpdateLessonInstance,
} = useUpdateLessonInstance()

const {RoomList} = roomState();
const {TeacherList} = teacherState();

const selectedTeachers = ref<{
    // selected teacher for each lesson instance
    [key: number]: TeacherType & { loading?: boolean }
}>({});

const instancesToRecycle = ref<{
    [key: number]: any
}>({});

const attemptRecycle = async (instance_id: number) => {
    props.setLoading?.(true)
    let instance = instancesToRecycle.value[instance_id];
    await updateLessonInstance(instance_id, {...instance}).then(() => {
        delete instancesToRecycle.value[instance_id];
    })
}
const updateLessonInstance = async (instance_id: number, value: any) => {
    props.setLoading?.(true)
    if (selectedTeachers.value[instance_id]) {
        selectedTeachers.value[instance_id].loading = true;
    }
    return await exeUpdateLessonInstance({
        data: {
            id: instance_id,
            ...value
        }
    }).then(() => {
        if (selectedTeachers.value[instance_id]) {
            selectedTeachers.value[instance_id].loading = false;
        }
        exeGlobalGetLessons({}).then(() => {
            props.setLoading?.(false)
        })
    }).catch(() => {
        if (selectedTeachers.value[instance_id]) {
            selectedTeachers.value[instance_id].loading = false;
        }
        props.setLoading?.(false)
    })
}
const updateLessonInstanceTeacher = async (instance: LessonInstanceType, teacher_id: number) => {
    if (instancesToRecycle.value[instance.id]){
        instancesToRecycle.value[instance.id].teacher_id =instance.teacher_id ;
    } else {
        instancesToRecycle.value[instance.id] = {teacher_id: instance.teacher_id}
    }
    console.log('instancesToRecycle', instancesToRecycle.value)
    await updateLessonInstance(instance.id, {teacher_id: teacher_id})
}

const headers = [
    {title: 'id', align: 'start' as const, sortable: false, key: 'id'},
    {title: 'Start/End', key: 'start'},
    {title: 'Duration', key: 'duration'},
    {title: 'Room', key: 'room_id'},
    {title: 'Teacher', key: 'teacher'},
    {title: 'Status', key: 'status'},
    {title: 'updated at', key: 'updated_at'},
] as const

const renderTeacherList = computed(() => {
    return TeacherList.value.map((teacher: TeacherType) => {
        return {
            title: teacher.name,
            subtitle: teacher.email,
        }
    })
})

const getRoomName = (id: number) => {
    return RoomList.value.find(room => room.id === id)?.name;
}


// onSucGlobalGetLessons((res)=>{
//     console.log(res)
//
// })
</script>
