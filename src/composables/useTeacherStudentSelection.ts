import moment from 'moment'
import { useLessonInstance } from "@/api/useLessonInstance"

export const useTeacherStudentSelection = (formData: any, calendarOptions: any) => {
  const { useGetTeacherLessonInstances, useGetStudentLessonInstances } = useLessonInstance()
  
  const {
    execute: exeGetTeacherLessonInstances,
  } = useGetTeacherLessonInstances();
  
  const {
    execute: exeGetStudentLessonInstances,
  } = useGetStudentLessonInstances();

  const selectTeacher = async () => {
    const id = formData.value.teacher_id;
    
    if (!id) {
      calendarOptions.value.events = calendarOptions.value.events.filter((ev: any) => 
        ev.extendedProps?.subject !== 'teacher'
      );
      return;
    }
    
    await exeGetTeacherLessonInstances({
      data: {
        teacher_id: id,
      }
    }).then((res: any) => {
      const teacherEvents = res.data?.value?.instances?.map((ev: any) => {
        return {
          title: "Teacher Occupied",
          start: moment(ev.start).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(ev.start).add(ev.duration, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
          allDay: false,
          className: 'marker-event-teacher',
          extendedProps: {
            marker: true,
            subject: 'teacher',
            lessonInstanceId: ev.id,
            lessonId: ev.lesson_id
          }
        }
      }) || []
      
      const currentEvents = calendarOptions.value.events.filter((ev: any) => 
        ev.extendedProps?.subject !== 'teacher'
      );
      
      calendarOptions.value.events = [...currentEvents, ...teacherEvents];
    })
  }

  const selectStudent = async () => {
    const id = formData.value.student_id;
    
    if (!id) {
      calendarOptions.value.events = calendarOptions.value.events.filter((ev: any) =>
          ev.extendedProps?.subject !== 'student'
      );
      return;
    }
    
    await exeGetStudentLessonInstances({
      data: {
        student_id: id,
      }
    }).then((res: any) => {
      const studentEvents = res.data?.value?.instances?.map((ev: any) => {
        return {
          title: "Student Occupied",
          start: moment(ev.start).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(ev.start).add(ev.duration, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
          allDay: false,
          className: 'marker-event-student',
          extendedProps: {
            marker: true,
            subject: 'student',
            lessonInstanceId: ev.id,
            lessonId: ev.lesson_id
          }
        }
      }) || []
      
      const currentEvents = calendarOptions.value.events.filter((ev: any) => 
        ev.extendedProps?.subject !== 'student'
      );
      
      calendarOptions.value.events = [...currentEvents, ...studentEvents];
    })
  }

  const getPlaningDayTeacherMarker = (i: string) => {
    const dayNumber = parseInt(moment().day(i).format('d'))
    return calendarOptions.value.events.filter((event: any) => {
      return event.extendedProps?.marker && 
             event.extendedProps?.subject === 'teacher' && 
             moment(event.start).day() === dayNumber
    })
  }

  const getPlaningDayStudentMarker = (i: string) => {
    const dayNumber = parseInt(moment().day(i).format('d'))
    return calendarOptions.value.events.filter((event: any) => {
      return event.extendedProps?.marker && 
             event.extendedProps?.subject === 'student' && 
             moment(event.start).day() === dayNumber
    })
  }

  return {
    selectTeacher,
    selectStudent,
    getPlaningDayTeacherMarker,
    getPlaningDayStudentMarker
  }
}