import {createGlobalState} from "@vueuse/core";
import {type Ref, ref, watch} from "vue";
import type {LessonInstanceType} from "@/stats/lessonInstanceState";

export interface LessonType {
    id: number,
    instances: LessonInstanceType[],
    price: number,
    payed_price: number,

    [key: string]: any
}

export const lessonState = createGlobalState(() => {
    const LessonList: Ref<LessonType[]> = ref([])
    const withTrashLesson = ref(false)
    const LessonsSelected: Ref<LessonType[]> = ref([])

    // Initialize lesson end notification monitoring
    let notificationSystem: any = null
    
    // Dynamically import and initialize notification system
    const initializeNotificationSystem = async () => {
        try {
            const { useLessonEndNotification } = await import('@/composables/useLessonEndNotification')
            notificationSystem = useLessonEndNotification(3) // 3 instances threshold
            
            // Check for lessons nearing end when lesson list is initially loaded
            if (LessonList.value.length > 0) {
                await notificationSystem.checkLessonsForEndNotifications()
            }
        } catch (error) {
            console.warn('Failed to initialize lesson end notification system:', error)
        }
    }

    // Watch for changes in lesson list and trigger notification checks
    watch(
        () => LessonList.value,
        async (newLessons, oldLessons) => {
            // Initialize notification system if not already done
            if (!notificationSystem && newLessons.length > 0) {
                await initializeNotificationSystem()
            }
            
            // Check for significant changes that warrant notification updates
            if (notificationSystem && newLessons.length > 0) {
                // Check if any lesson instance statuses have changed
                const hasStatusChanges = newLessons.some((newLesson, index) => {
                    const oldLesson = oldLessons?.[index]
                    if (!oldLesson || oldLesson.id !== newLesson.id) return true
                    
                    return newLesson.instances.some((newInstance, instIndex) => {
                        const oldInstance = oldLesson.instances?.[instIndex]
                        return !oldInstance || oldInstance.id !== newInstance.id || 
                               oldInstance.status !== newInstance.status
                    })
                })
                
                if (hasStatusChanges) {
                    await notificationSystem.checkLessonsForEndNotifications()
                }
            }
        },
        { deep: true }
    )

    return {
        LessonList,
        LessonsSelected,
        withTrashLesson,
    };

});
