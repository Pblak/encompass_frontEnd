import type { LessonType } from '@/stats/lessonState'
import type { LessonInstanceType } from '@/stats/lessonInstanceState'
import moment from 'moment'

export interface LessonEndAnalysis {
  lesson: LessonType
  totalInstances: number
  completedInstances: number
  scheduledInstances: number
  inProgressInstances: number
  cancelledInstances: number
  remainingInstances: number
  completionPercentage: number
  isNearingEnd: boolean
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  estimatedEndDate?: string
}

/**
 * Comprehensive analysis of lesson completion status
 */
export const analyzeLessonCompletion = (
  lesson: LessonType, 
  nearEndThreshold: number = 3
): LessonEndAnalysis => {
  const instances = lesson.instances || []
  
  const totalInstances = instances.length
  const completedInstances = instances.filter(i => i.status === 'completed').length
  const scheduledInstances = instances.filter(i => i.status === 'scheduled').length
  const inProgressInstances = instances.filter(i => i.status === 'in_progress').length
  const cancelledInstances = instances.filter(i => i.status === 'cancelled').length
  
  // Count future instances (from today onwards, excluding cancelled)
  const today = moment().startOf('day')
  const futureInstances = instances.filter(i => 
    moment(i.start).isSameOrAfter(today) && 
    (i.status === 'scheduled' || i.status === 'in_progress')
  )
  const remainingInstances = futureInstances.length
  
  const completionPercentage = totalInstances > 0 ? 
    Math.round((completedInstances / totalInstances) * 100) : 0

  const isNearingEnd = remainingInstances <= nearEndThreshold && remainingInstances > 0

  // Determine urgency level
  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  if (remainingInstances === 0) {
    urgencyLevel = 'low' // Completed
  } else if (remainingInstances === 1) {
    urgencyLevel = 'critical'
  } else if (remainingInstances <= 2) {
    urgencyLevel = 'high'
  } else if (remainingInstances <= nearEndThreshold) {
    urgencyLevel = 'medium'
  }

  // Estimate end date based on future instances
  let estimatedEndDate: string | undefined
  const sortedFutureInstances = futureInstances
    .sort((a, b) => moment(a.start).diff(moment(b.start)))
  
  if (sortedFutureInstances.length > 0) {
    const lastInstance = sortedFutureInstances[sortedFutureInstances.length - 1]
    estimatedEndDate = moment(lastInstance.start).format('YYYY-MM-DD')
  }

  return {
    lesson,
    totalInstances,
    completedInstances,
    scheduledInstances,
    inProgressInstances,
    cancelledInstances,
    remainingInstances,
    completionPercentage,
    isNearingEnd,
    urgencyLevel,
    estimatedEndDate
  }
}

/**
 * Get lessons that need admin attention (nearing end)
 */
export const getLessonsNeedingAttention = (
  lessons: LessonType[], 
  threshold: number = 3
): LessonEndAnalysis[] => {
  return lessons
    .map(lesson => analyzeLessonCompletion(lesson, threshold))
    .filter(analysis => analysis.isNearingEnd)
    .sort((a, b) => {
      // Sort by urgency level first, then by remaining instances
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const urgencyDiff = urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel]
      
      if (urgencyDiff !== 0) return urgencyDiff
      return a.remainingInstances - b.remainingInstances
    })
}

/**
 * Generate notification message based on lesson analysis
 */
export const generateNotificationMessage = (analysis: LessonEndAnalysis): string => {
  const { lesson, remainingInstances, urgencyLevel, estimatedEndDate } = analysis
  
  const studentName = lesson.student?.name || 'Unknown Student'
  const instrumentName = lesson.instrument?.name || 'Unknown Instrument'
  
  let message = `${studentName} - ${instrumentName} has only ${remainingInstances} session${remainingInstances > 1 ? 's' : ''} left`
  
  if (urgencyLevel === 'critical') {
    message += ' (FINAL SESSION!)'
  } else if (urgencyLevel === 'high') {
    message += ' (URGENT)'
  }
  
  if (estimatedEndDate) {
    message += `. Expected completion: ${moment(estimatedEndDate).format('MMM DD, YYYY')}`
  }
  
  return message
}

/**
 * Check if a lesson analysis has changed significantly (for notification updates)
 */
export const hasSignificantChange = (
  oldAnalysis: LessonEndAnalysis | null, 
  newAnalysis: LessonEndAnalysis
): boolean => {
  if (!oldAnalysis) return true
  
  return (
    oldAnalysis.remainingInstances !== newAnalysis.remainingInstances ||
    oldAnalysis.urgencyLevel !== newAnalysis.urgencyLevel ||
    oldAnalysis.isNearingEnd !== newAnalysis.isNearingEnd
  )
}

/**
 * Get summary statistics for admin dashboard
 */
export const getLessonEndSummary = (lessons: LessonType[], threshold: number = 3) => {
  const analyses = lessons.map(lesson => analyzeLessonCompletion(lesson, threshold))
  
  return {
    total: lessons.length,
    nearingEnd: analyses.filter(a => a.isNearingEnd).length,
    critical: analyses.filter(a => a.urgencyLevel === 'critical').length,
    high: analyses.filter(a => a.urgencyLevel === 'high').length,
    medium: analyses.filter(a => a.urgencyLevel === 'medium').length,
    averageCompletion: analyses.length > 0 ? 
      Math.round(analyses.reduce((sum, a) => sum + a.completionPercentage, 0) / analyses.length) : 0
  }
}