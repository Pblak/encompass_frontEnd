import { ref, Ref } from 'vue'
import moment from 'moment'
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'

export const useCalendarLogic = (formData: Ref<any>) => {
  const cal = ref<any>(null)
  const fakeLessonInstances = ref<any[]>([])

  const calendarOptions = ref<any>({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    initialDate: moment(formData.value.start_date).format('YYYY-MM-DD'),
    handleWindowResize: true,
    nowIndicator: true,
    now: moment(formData.value.start_date).format('YYYY-MM-DD'),
    firstDay: moment(formData.value.start_date).day(),
    allDaySlot: false,
    visibleRange: {
      start: moment(formData.value.start_date).format('YYYY-MM-DD'),
      end: moment(formData.value.start_date).add(7, 'days').format('YYYY-MM-DD')
    },
    headerToolbar: {
      left: 'customToday',
      center: 'title',
      right: 'prev,next',
    },
    customButtons: {
      customToday: {
        text: 'Today',
        click: function() {
          if (cal.value) {
            const calendarApi = cal.value.getApi();
            calendarApi.gotoDate(moment(formData.value.start_date).format('YYYY-MM-DD'));
            
            const totalWeeks = formData.value.frequency || 1;
            calendarApi.setOption('visibleRange', {
              start: moment(formData.value.start_date).format('YYYY-MM-DD'),
              end: moment(formData.value.start_date).add(7 * totalWeeks, 'days').format('YYYY-MM-DD')
            });
          }
        }
      }
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: 'short'
    },
    dayHeaderFormat: {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '19:00:00',
    selectable: true,
    events: [],
    selectAllow: function (selectInfo: any): boolean {
      const startDate = moment(formData.value.start_date).startOf('day');
      const maxDate = moment(formData.value.start_date).startOf('day').add(6, 'days');
      const start = moment(selectInfo.start);
      const end = moment(selectInfo.end);

      return (
          start.isBetween(startDate.clone().subtract(1, 'minute'), maxDate.clone().add(1, 'day'), null, '[)') &&
          end.isBetween(startDate.clone().subtract(1, 'minute'), maxDate.clone().add(1, 'day'), null, '[)')
      );
    },
    dayCellDidMount: (info: any) => {
      const cellDate = moment(info.date).startOf('day');
      const startDate = moment(formData.value.start_date).startOf('day');
      const maxDate = moment(formData.value.start_date).startOf('day').add(6, 'days');

      if (cellDate.isBefore(startDate) || cellDate.isAfter(maxDate)) {
        info.el.classList.add('fc-disabled-day');
      } else {
        info.el.classList.add('fc-allowed-day');
      }
    },
    datesSet: (info: any) => {
      if (formData.value.frequency > 1 && cal.value) {
        const totalWeeks = formData.value.frequency;
        const currentStart = moment(info.start);
        const expectedStart = moment(formData.value.start_date).startOf('day');
        
        if (!currentStart.isSame(expectedStart, 'week')) {
          setTimeout(() => {
            if (cal.value) {
              cal.value.getApi().setOption('visibleRange', {
                start: moment(formData.value.start_date).format('YYYY-MM-DD'),
                end: moment(formData.value.start_date).add(7 * totalWeeks, 'days').format('YYYY-MM-DD')
              });
            }
          }, 100);
        }
      }
    },
  })

  const createFakeLessonInstances = () => {
    fakeLessonInstances.value = []
    
    if (!formData.value.frequency || formData.value.frequency <= 1) {
      calendarOptions.value.events = calendarOptions.value.events.filter((event: any) => 
        !event.extendedProps?.fake
      )
      
      if (cal.value) {
        cal.value.getApi().setOption('visibleRange', {
          start: moment(formData.value.start_date).format('YYYY-MM-DD'),
          end: moment(formData.value.start_date).add(7, 'days').format('YYYY-MM-DD')
        });
      }
      return
    }
    
    const plannedEvents = calendarOptions.value.events.filter((event: any) => 
      !event.extendedProps?.marker && !event.extendedProps?.fake
    )
    
    const fakeInstances: any[] = []
    
    plannedEvents.forEach((event: any) => {
      for (let week = 1; week < formData.value.frequency; week++) {
        const fakeStart = moment(event.start).add(week, 'weeks')
        const fakeEnd = moment(event.end).add(week, 'weeks')
        
        fakeInstances.push({
          title: `Week ${week + 1}`,
          start: fakeStart.format('YYYY-MM-DD HH:mm:ss'),
          end: fakeEnd.format('YYYY-MM-DD HH:mm:ss'),
          allDay: false,
          className: 'fake-lesson-instance',
          extendedProps: {
            marker: false,
            fake: true,
            weekNumber: week + 1,
            originalEventStart: event.start
          }
        })
      }
    })
    
    fakeLessonInstances.value = fakeInstances
    
    const nonFakeEvents = calendarOptions.value.events.filter((event: any) => 
      !event.extendedProps?.fake
    )
    calendarOptions.value.events = [...nonFakeEvents, ...fakeInstances]
    
    if (fakeInstances.length > 0 && cal.value) {
      const totalWeeks = formData.value.frequency;
      cal.value.getApi().setOption('visibleRange', {
        start: moment(formData.value.start_date).format('YYYY-MM-DD'),
        end: moment(formData.value.start_date).add(7 * totalWeeks, 'days').format('YYYY-MM-DD')
      });
    }
  }

  const addEvent = (info: any) => {
    const day = moment(info.start).day();
    const time = moment(info.start).format('HH:mm:ss');
    
    if ((formData.value.planning[day] && formData.value.planning[day].length >= 2) || !formData.value.instrument_plan) {
      return;
    }
    
    const duration = formData.value.instrument_plan?.duration ? formData.value.instrument_plan?.duration : 30;
    
    const p = calendarOptions.value.events.filter((ev: any) => {
      if (ev.extendedProps.marker) {
        return true;
      }

      const evDay = moment(ev.start).day();
      const evTime = moment(ev.start).format('HH:mm:ss');

      return !(evDay === day
          && (evTime === time || evTime <= moment(info.start).add(duration, 'minutes').format('HH:mm:ss') ||
              evTime === moment(info.start).subtract(duration, 'minutes').format('HH:mm:ss')))
    })
    
    const newEvent = {
      title: '',
      start: moment(info.start).toISOString(),
      end: moment(info.start).add(formData.value.instrument_plan?.duration || 30, 'minutes').toISOString(),
      allDay: info.allDay,
      extendedProps: {
        marker: false,
      }
    }
    
    p.push(newEvent)

    calendarOptions.value.events = p;
    createFakeLessonInstances();
  }

  const removeEvent = (info: any) => {
    if (info.event.extendedProps.marker) {
      return;
    }
    
    calendarOptions.value.events = calendarOptions.value.events.filter((ev: any) => {
      if (ev.extendedProps.marker) {
        return true;
      } else {
        return !moment(ev.start).isSame(info.event.start);
      }
    })
    
    createFakeLessonInstances();
  }

  const updateLessonStartDate = (event: string | Date) => {
    formData.value.start_date = moment(event as string).add('8', 'hours')
        .format('YYYY-MM-DD HH:mm:ss');

    if (cal.value) {
      const calendarApi = cal.value.getApi();
      calendarApi.gotoDate(moment(formData.value.start_date).format('YYYY-MM-DD'));

      calendarApi.setOption('visibleRange', {
        start: moment(formData.value.start_date).format('YYYY-MM-DD'),
        end: moment(formData.value.start_date).add(7, 'days').format('YYYY-MM-DD')
      });
    }
  }

  return {
    cal,
    calendarOptions,
    fakeLessonInstances,
    createFakeLessonInstances,
    addEvent,
    removeEvent,
    updateLessonStartDate
  }
}