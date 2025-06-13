import { ref, computed } from 'vue'
import moment from 'moment'

interface LessonInstanceType {
  id: number
  deleted_at: Boolean | string
  duration: number
  lesson_id: number
  room_id: number
  start: string
  status: "in_progress" | "scheduled" | "completed" | "cancelled"
  updated_at: string
  created_at: string
  [key: string]: any
}

interface LessonType {
  id: number
  instances: LessonInstanceType[]
  price: number
  payed_price: number
  teacher_id?: number
  student_id?: number
  instrument_id?: number
  room_id?: number
  instrument_plan?: any
  notes?: string
  teacher?: any
  student?: any
  instrument?: any
  [key: string]: any
}

interface RenewLessonData {
  teacher_id: string | number
  student_id: string | number
  instrument_id: string | number
  room_id: string | number
  planning: Record<number, Array<{ time: string; day: number }>>
  frequency: number
  start_date: string
  instrument_plan: any
  price: number
  active: number
  notes: string
}

export const useRenewLesson = () => {
  const isRenewMode = ref(false)
  const originalLesson = ref<LessonType | null>(null)

  /**
   * Calculate the next start date based on lesson instances
   * Finds the date for the next week after the original lesson series ends
   */
  const calculateNextStartDate = (instances: LessonInstanceType[]): string => {
    if (!instances || instances.length === 0) {
      return moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }

    // Sort instances by start date to find the latest (last instance)
    const sortedInstances = [...instances].sort((a, b) => 
      moment(a.start).isAfter(moment(b.start)) ? -1 : 1
    )

    const lastInstance = sortedInstances[0]
    const lastInstanceDate = moment(lastInstance.start)
    
    // Calculate the start of the next week after the last instance
    // Add 7 days to move to the next week
    const nextStartDate = lastInstanceDate.clone().add(7, 'days')
    
    return nextStartDate.format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * Extract planning data from lesson instances
   * Converts lesson instances back to the planning format used by the form
   */
  const extractPlanningFromInstances = (instances: LessonInstanceType[]): Record<number, Array<{ time: string; day: number }>> => {
    const planning: Record<number, Array<{ time: string; day: number }>> = {}

    instances.forEach(instance => {
      const startDate = moment(instance.start)
      const dayOfWeek = startDate.day()
      const timeString = startDate.format('HH:mm:ss')

      if (!planning[dayOfWeek]) {
        planning[dayOfWeek] = []
      }

      // Check if this time slot already exists to avoid duplicates
      const existingSlot = planning[dayOfWeek].find(slot => slot.time === timeString)
      if (!existingSlot) {
        planning[dayOfWeek].push({
          time: timeString,
          day: dayOfWeek
        })
      }
    })

    return planning
  }

  /**
   * Calculate frequency from lesson instances
   * Determines how many weeks the original lesson pattern repeated
   */
  const calculateFrequencyFromInstances = (instances: LessonInstanceType[]): number => {
    if (!instances || instances.length === 0) return 1

    // Get unique days of the week from instances
    const uniqueDays = new Set(instances.map(instance => moment(instance.start).day()))
    const uniqueDaysCount = uniqueDays.size

    if (uniqueDaysCount === 0) return 1

    // Frequency = total instances / unique days per week
    const frequency = Math.ceil(instances.length / uniqueDaysCount)
    
    return Math.max(frequency, 1) // Ensure minimum frequency of 1
  }

  /**
   * Get calendar events from lesson instances for visualization
   * Returns empty array since we don't want to show previous instances during renewal
   */
  const getCalendarEventsFromInstances = (instances: LessonInstanceType[], baseDate: string) => {
    // Don't show previous lesson instances during renewal
    // Let the lesson creation system handle event generation based on the new planning data
    return []
  }

  /**
   * Transform lesson data for form prefilling
   */
  const transformLessonForRenewal = (lesson: LessonType): RenewLessonData => {
    const nextStartDate = calculateNextStartDate(lesson.instances)
    const planning = extractPlanningFromInstances(lesson.instances)
    const frequency = calculateFrequencyFromInstances(lesson.instances)

    return {
      teacher_id: lesson.teacher_id || '',
      student_id: lesson.student_id || '',
      instrument_id: lesson.instrument_id || '',
      room_id: lesson.room_id || '',
      planning,
      frequency, // Use the same frequency as the original lesson
      start_date: nextStartDate,
      instrument_plan: lesson.instrument_plan || null, // Keep the complete plan object
      price: 0, // Will be recalculated
      active: 1,
      notes: lesson.notes || ''
    }
  }

  /**
   * Get the last instance date for reference
   */
  const getLastInstanceDate = (instances: LessonInstanceType[]): string => {
    if (!instances || instances.length === 0) return ''
    
    const sortedInstances = [...instances].sort((a, b) => 
      moment(a.start).isAfter(moment(b.start)) ? -1 : 1
    )
    
    return moment(sortedInstances[0].start).format('YYYY-MM-DD')
  }

  /**
   * Check if lesson can be renewed
   */
  const canRenewLesson = (lesson: LessonType): boolean => {
    if (!lesson.instances || lesson.instances.length === 0) return false
    
    // Check if lesson has any completed or scheduled instances
    const hasValidInstances = lesson.instances.some(instance => 
      instance.status === 'completed' || instance.status === 'scheduled'
    )
    
    return hasValidInstances
  }

  /**
   * Get renewal summary for user confirmation
   */
  const getRenewalSummary = computed(() => {
    if (!originalLesson.value) return null

    const lastInstanceDate = getLastInstanceDate(originalLesson.value.instances)
    const nextStartDate = calculateNextStartDate(originalLesson.value.instances)
    const totalInstances = originalLesson.value.instances.length
    const completedInstances = originalLesson.value.instances.filter(i => i.status === 'completed').length

    return {
      lastInstanceDate,
      nextStartDate,
      totalInstances,
      completedInstances,
      teacherName: originalLesson.value.teacher?.name || 'Unknown',
      studentName: originalLesson.value.student?.name || 'Unknown',
      instrumentName: originalLesson.value.instrument?.name || 'Unknown'
    }
  })

  /**
   * Initialize renewal mode
   */
  const initializeRenewal = (lesson: LessonType) => {
    isRenewMode.value = true
    originalLesson.value = lesson
  }

  /**
   * Reset renewal mode
   */
  const resetRenewal = () => {
    isRenewMode.value = false
    originalLesson.value = null
  }

  return {
    isRenewMode,
    originalLesson,
    calculateNextStartDate,
    extractPlanningFromInstances,
    calculateFrequencyFromInstances,
    getCalendarEventsFromInstances,
    transformLessonForRenewal,
    getLastInstanceDate,
    canRenewLesson,
    getRenewalSummary,
    initializeRenewal,
    resetRenewal
  }
}