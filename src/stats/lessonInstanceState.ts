import {createGlobalState} from "@vueuse/core";
import {type Ref, ref} from "vue";
import type {LessonType} from "@/stats/lessonState";

export const lessonInstanceStatus = {
    'scheduled': {
        'name': 'Scheduled',
        'color': 'gray',
        'icon': 'fa-duotone fa-timeline-arrow',
        'allowTransition': ['in_progress', 'cancelled','completed']
    },
    'in_progress': {
        'name': 'In Progress',
        'color': 'blue',
        'icon': 'fa-duotone fa-hourglass-start fa-beat-fade',
        'allowTransition': ['completed', 'cancelled']
    },
    'completed': {
        'name': 'Completed',
        'color': 'green',
        'icon': 'fa-duotone fa-check',
        'allowTransition': ['scheduled', 'in_progress']
    },
    'cancelled': {
        'name': 'Cancelled',
        'color': 'red',
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
