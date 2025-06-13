import { ref, watch } from 'vue'
import { lessonState, type LessonType } from '@/stats/lessonState'
import { loginState } from '@/stats/loginState'
import { useNotification } from '@/api/useNotification'
import type { LessonInstanceType } from '@/stats/lessonInstanceState'
import moment from 'moment'

interface LessonEndNotificationData {
  lesson_id: number
  student_name: string
  instrument_name: string
  remaining_instances: number
  type: 'lesson_ending'
  priority: 'high' | 'medium'
}

export const useLessonEndNotification = (threshold: number = 3) => {
  const { LessonList } = lessonState()
  const { userLogin } = loginState()
  const { useCreateNotification } = useNotification()
  const { execute: createNotification } = useCreateNotification()
  
  // Track which lessons have already been notified to prevent duplicates
  const notifiedLessons = ref<Set<number>>(new Set())

  /**
   * Calculate remaining instances for a lesson (future non-cancelled instances)
   */
  const getRemainingInstances = (lesson: LessonType): number => {
    const today = moment().startOf('day')
    return lesson.instances.filter((instance: LessonInstanceType) => 
      moment(instance.start).isSameOrAfter(today) && 
      (instance.status === 'scheduled' || instance.status === 'in_progress')
    ).length
  }

  /**
   * Check if a lesson is nearing its end
   */
  const isLessonNearingEnd = (lesson: LessonType): boolean => {
    const remaining = getRemainingInstances(lesson)
    return remaining <= threshold && remaining > 0
  }

  /**
   * Check if current user is admin
   */
  const isAdmin = (): boolean => {
    return userLogin.value?.accountType === 'admin'
  }

  /**
   * Create notification data for a lesson nearing end
   */
  const createNotificationData = (lesson: LessonType): LessonEndNotificationData => {
    const remaining = getRemainingInstances(lesson)
    
    return {
      lesson_id: lesson.id,
      student_name: lesson.student?.name || 'Unknown Student',
      instrument_name: lesson.instrument?.name || 'Unknown Instrument',
      remaining_instances: remaining,
      type: 'lesson_ending',
      priority: remaining <= 1 ? 'high' : 'medium'
    }
  }

  /**
   * Send notification to admin
   */
  const sendLessonEndNotification = async (lesson: LessonType): Promise<void> => {
    if (!isAdmin()) {
      return // Only send notifications to admins
    }

    if (notifiedLessons.value.has(lesson.id)) {
      return // Already notified for this lesson
    }

    const notificationData = createNotificationData(lesson)
    
    try {
      await createNotification({
        data: {
          title: 'Lesson Ending Soon',
          message: `${notificationData.student_name} - ${notificationData.instrument_name} has only ${notificationData.remaining_instances} session${notificationData.remaining_instances > 1 ? 's' : ''} left`,
          type: notificationData.type,
          priority: notificationData.priority,
          metadata: {
            lesson_id: notificationData.lesson_id,
            remaining_instances: notificationData.remaining_instances
          },
          recipient_role: 'admin'
        }
      })
      
      // Mark this lesson as notified
      notifiedLessons.value.add(lesson.id)
      
      console.log(`Admin notification sent for lesson ${lesson.id}: ${notificationData.student_name} - ${notificationData.instrument_name}`)
    } catch (error) {
      console.error('Failed to send lesson end notification:', error)
    }
  }

  /**
   * Check all lessons for ones nearing end and send notifications
   */
  const checkLessonsForEndNotifications = async (): Promise<void> => {
    if (!isAdmin() || !LessonList.value.length) {
      return
    }

    const lessonsNearingEnd = LessonList.value.filter(isLessonNearingEnd)
    
    for (const lesson of lessonsNearingEnd) {
      await sendLessonEndNotification(lesson)
    }
  }

  /**
   * Reset notification tracking (useful when lessons are updated significantly)
   */
  const resetNotificationTracking = (): void => {
    notifiedLessons.value.clear()
  }

  /**
   * Remove a lesson from notification tracking (when instances are added)
   */
  const removeFromNotificationTracking = (lessonId: number): void => {
    notifiedLessons.value.delete(lessonId)
  }

  /**
   * Get lessons that are currently nearing end
   */
  const getLessonsNearingEnd = (): LessonType[] => {
    return LessonList.value.filter(isLessonNearingEnd)
  }

  /**
   * Watch for changes in lesson list and check for notifications
   */
  watch(
    () => LessonList.value,
    async (newLessons, oldLessons) => {
      if (!isAdmin()) return

      // Check if any lesson instances have changed status
      const shouldCheck = newLessons.some((newLesson, index) => {
        const oldLesson = oldLessons?.[index]
        if (!oldLesson) return true
        
        // Check if any instance status changed
        return newLesson.instances.some((newInstance, instIndex) => {
          const oldInstance = oldLesson.instances?.[instIndex]
          return oldInstance && newInstance.status !== oldInstance.status
        })
      })

      if (shouldCheck) {
        await checkLessonsForEndNotifications()
      }
    },
    { deep: true }
  )

  return {
    getRemainingInstances,
    isLessonNearingEnd,
    checkLessonsForEndNotifications,
    sendLessonEndNotification,
    resetNotificationTracking,
    removeFromNotificationTracking,
    getLessonsNearingEnd,
    notifiedLessons: notifiedLessons.value
  }
}