import {createGlobalState} from "@vueuse/core";
import {type Ref, ref} from "vue";
import type {LessonType} from "@/stats/lessonState";

export interface LessonInstanceType {
    id: number,
    deleted_at: Boolean | string,
    duration:  number,
    lesson_id: number,
    room_id: number,
    teacher_id?: number,
    start:  string,
    status: "in_progress" | "scheduled" | "completed" | "cancelled",
    updated_at:  string,
    created_at:  string,
    teacher?: any,
    lesson?: any,
    [key: string]: any,
}
export const lessonInstanceStatus = {
    'scheduled': {
        'name': 'Scheduled',
        'color': 'gray',
        'icon': 'fa-duotone fa-timeline-arrow',
        'allowTransition': ['in_progress', 'cancelled','completed']
    },
    'in_progress': {
        'name': 'In Progress',
        'color': '#086cb6',
        'icon': 'fa-duotone fa-hourglass-start fa-beat-fade',
        'allowTransition': ['completed', 'cancelled']
    },
    'completed': {
        'name': 'Completed',
        'color': '#06d34f',
        'icon': 'fa-duotone fa-check',
        'allowTransition': ['scheduled', 'in_progress']
    },
    'cancelled': {
        'name': 'Cancelled',
        'color': '#d80000',
        'icon': 'fa-duotone fa-hexagon-xmark',
        'allowTransition': []
    }
}
export const  lessonInstanceState = createGlobalState(() => {
    // const LessonInstanceList = useStorage("instrumentList", [], undefined, {serializer: StorageSerializers.object})
    const LessonInstanceList:Ref<LessonType[]> = ref([])

    return {
        LessonInstanceList,
    };

});
