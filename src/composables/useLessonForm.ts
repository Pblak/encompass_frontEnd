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
    instrument_plan: "" as any,
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
    formData.value.price = total * parseInt(formData.value.instrument_plan?.price) * formData.value.frequency
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
      instrument_plan: "" as any,
      start_date: moment().add('8', 'hours').toISOString(),
      price: 0,
      active: 1,
      notes: ''
    }
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
    getPlaningDay
  }
}