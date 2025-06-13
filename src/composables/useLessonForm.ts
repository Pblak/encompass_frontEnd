import { ref, computed } from 'vue'
import moment from 'moment'
import { toCurrency } from "@/stats/Utils"

interface Planning {
  [key: number]: Array<{
    time: string,
    day: number
  }>
}

export const useLessonForm = (InstrumentList: any) => {
  const FormEl = ref(null)
  
  const formData = ref({
    teacher_id: '',
    student_id: '',
    instrument_id: '',
    room_id: '',
    planning: {} as Planning,
    frequency: 1,
    start_date: moment().add('8', 'hours').toISOString(),
    instrument_plan: null as any,
    price: 0,
    active: 1,
    notes: ''
  })

  const getPlans = computed(() => {
    if (!formData.value.instrument_id) return []
    return InstrumentList.value.find((res: any) => res.id === formData.value.instrument_id)?.plans
  })

  const calculatePrice = () => {
    if (!formData.value.instrument_plan) return 0;
    const total = Object.values(formData.value.planning).reduce((acc, val) => {
      return acc + val.length
    }, 0)
    formData.value.price = total * parseInt(formData.value.instrument_plan?.price || 0) * formData.value.frequency
    return toCurrency(formData.value.price)
  }

  const resetForm = () => {
    if (FormEl.value) (FormEl.value as any).reset();
    formData.value = {
      teacher_id: '',
      student_id: '',
      instrument_id: '',
      room_id: '',
      planning: {} as Planning,
      frequency: 1,
      instrument_plan: null as any,
      start_date: moment().add('8', 'hours').toISOString(),
      price: 0,
      active: 1,
      notes: ''
    }
  }

  /**
   * Prefill form with lesson data (for renewal)
   */
  const prefillForm = (lessonData: any) => {
    formData.value = {
      teacher_id: lessonData.teacher_id || '',
      student_id: lessonData.student_id || '',
      instrument_id: lessonData.instrument_id || '',
      room_id: lessonData.room_id || '',
      planning: lessonData.planning || {} as Planning,
      frequency: lessonData.frequency || 1,
      instrument_plan: lessonData.instrument_plan || null as any,
      start_date: lessonData.start_date || moment().add('8', 'hours').toISOString(),
      price: lessonData.price || 0,
      active: lessonData.active || 1,
      notes: lessonData.notes || ''
    }
  }

  /**
   * Get next available date after lesson instances
   */
  const getNextAvailableDate = (instances: any[]): string => {
    if (!instances || instances.length === 0) {
      return moment().add('1', 'day').format('YYYY-MM-DD HH:mm:ss')
    }

    // Sort instances by start date to find the latest
    const sortedInstances = [...instances].sort((a, b) => 
      moment(a.start).isAfter(moment(b.start)) ? -1 : 1
    )

    const lastInstance = sortedInstances[0]
    const lastInstanceDate = moment(lastInstance.start)
    
    // Add the duration to get the end time, then add buffer for next week
    const nextStartDate = lastInstanceDate.clone().add(7, 'days')
    
    return nextStartDate.format('YYYY-MM-DD HH:mm:ss')
  }

  const getPlaningDay = (i: string) => {
    const day = formData.value.planning[parseInt(moment().day(i).format('d'))]
    return day ? day : []
  }

  return {
    FormEl,
    formData,
    getPlans,
    calculatePrice,
    resetForm,
    prefillForm,
    getNextAvailableDate,
    getPlaningDay
  }
}