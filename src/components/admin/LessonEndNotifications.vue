<template>
  <v-card>
    <v-card-title class="_flex _items-center _gap-2">
      <v-icon color="orange">fa-duotone fa-exclamation-triangle</v-icon>
    Lessons Ending Soon
      <v-spacer></v-spacer>
      <v-chip 
        v-if="lessonsNearingEnd.length > 0" 
        :color="getUrgencyColor()" 
        size="small">
        {{ lessonsNearingEnd.length }} lesson{{ lessonsNearingEnd.length > 1 ? 's' : '' }}
      </v-chip>
    </v-card-title>
    
    <v-card-text v-if="!isAdmin" class="_text-center _py-8">
      <v-icon size="48" color="grey">fa-duotone fa-lock</v-icon>
      <p class="_text-grey _mt-4">Admin access required</p>
    </v-card-text>
    
    <v-card-text v-else-if="loading" class="_text-center _py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="_mt-4">Loading lesson data...</p>
    </v-card-text>
    
    <v-card-text v-else-if="lessonsNearingEnd.length === 0" class="_text-center _py-8">
      <v-icon size="48" color="green">fa-duotone fa-check-circle</v-icon>
      <p class="_text-green _mt-4">All lessons are on track!</p>
    </v-card-text>
    
    <v-card-text v-else class="!_p-0">
      <v-list>
        <v-list-item 
          v-for="analysis in lessonsNearingEnd" 
          :key="analysis.lesson.id"
          :prepend-avatar="getStudentAvatar(analysis.lesson)"
          @click="$emit('lessonSelected', analysis.lesson)">
          
          <v-list-item-title class="_flex _items-center _gap-2">
            {{ analysis.lesson.student?.name || 'Unknown Student' }}
            <v-chip 
              :color="getUrgencyChipColor(analysis.urgencyLevel)" 
              size="x-small"
              :variant="analysis.urgencyLevel === 'critical' ? 'elevated' : 'tonal'">
              {{ analysis.urgencyLevel.toUpperCase() }}
            </v-chip>
          </v-list-item-title>
          
          <v-list-item-subtitle class="_text-xs">
            <div class="_flex _flex-col _gap-1">
              <span>{{ analysis.lesson.instrument?.name || 'Unknown Instrument' }}</span>
              <span class="_font-medium">
                {{ analysis.remainingInstances }} session{{ analysis.remainingInstances > 1 ? 's' : '' }} remaining
                <span v-if="analysis.estimatedEndDate" class="_text-grey">
                  (Est. completion: {{ formatDate(analysis.estimatedEndDate) }})
                </span>
              </span>
            </div>
          </v-list-item-subtitle>
          
          <template v-slot:append>
            <div class="_flex _flex-col _items-end _gap-1">
              <v-progress-circular
                :model-value="analysis.completionPercentage"
                :color="getProgressColor(analysis.completionPercentage)"
                size="32"
                width="3">
                <span class="_text-xs">{{ analysis.completionPercentage }}%</span>
              </v-progress-circular>
              <v-btn
                icon="fa-thin fa-chevron-right"
                variant="text"
                size="x-small"
                color="grey"></v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    
    <v-card-actions v-if="lessonsNearingEnd.length > 0">
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        variant="text" 
        @click="refreshData">
        <v-icon left>fa-thin fa-refresh</v-icon>
        Refresh
      </v-btn>
      <v-btn 
        color="orange" 
        variant="tonal" 
        @click="$emit('viewAllLessons')">
        View All Lessons
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { lessonState } from '@/stats/lessonState'
import { loginState } from '@/stats/loginState'
import { getLessonsNeedingAttention, type LessonEndAnalysis } from '@/utils/lessonEndDetector'
import moment from 'moment'

// Props and Emits
defineEmits<{
  lessonSelected: [lesson: any]
  viewAllLessons: []
}>()

// State
const { LessonList } = lessonState()
const { userLogin } = loginState()
const loading = ref(false)
const APP_URL = import.meta.env.VITE_APP_URL;
// Computed
const isAdmin = computed(() => userLogin.value?.accountType === 'users')

const lessonsNearingEnd = computed((): LessonEndAnalysis[] => {
  if (!isAdmin.value || !LessonList.value.length) return []
return getLessonsNeedingAttention(LessonList.value, 3)
})

// Methods
const getUrgencyColor = (): string => {
  const criticalCount = lessonsNearingEnd.value.filter(l => l.urgencyLevel === 'critical').length
  const highCount = lessonsNearingEnd.value.filter(l => l.urgencyLevel === 'high').length
  
  if (criticalCount > 0) return 'red'
  if (highCount > 0) return 'orange'
  return 'yellow'
}

const getUrgencyChipColor = (urgency: string): string => {
  switch (urgency) {
    case 'critical': return 'red'
    case 'high': return 'orange'
    case 'medium': return 'yellow'
    default: return 'grey'
  }
}

const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'red'
  if (percentage >= 60) return 'orange'
  if (percentage >= 40) return 'yellow'
  return 'green'
}

const getStudentAvatar = (lesson: any): string => {
  if (lesson.student?.infos?.avatar) {
    return `${APP_URL}${lesson.student.infos.avatar}`
  }else {

    return  'https://cdn.vuetifyjs.com/images/cards/foster.jpg'
  }
}

const formatDate = (dateString: string): string => {
  return moment(dateString).format('MMM DD, YYYY')
}

const refreshData = async (): Promise<void> => {
  loading.value = true
  try {
    // Force refresh of lesson data
    // This would typically trigger a re-fetch from the API
    // The exact implementation depends on your data fetching strategy
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (isAdmin.value && LessonList.value.length === 0) {
    // If no lessons are loaded, you might want to trigger a fetch here
    // exeGlobalGetLessons() // Uncomment if you have access to this function
  }
})
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>