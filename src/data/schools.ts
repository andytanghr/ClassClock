import { School } from '../@types/scheduleData'

export const lohs: School = {
  fullName: 'Lake Oswego High School',
  shortName: 'LOHS',
  passingPeriodName: 'Passing Period',
  timeZone: '',
  schedules: [
    {
      name: 'Mon/Thurs/Fri (Regular)',
      days: [1, 4, 5],
      classes: [
        {
          name: '1st Period',
          startTime: { hours: 8, minutes: 25 },
          endTime: { hours: 9, minutes: 55 }
        },
        {
          name: 'TSCT',
          startTime: { hours: 9, minutes: 55 },
          endTime: { hours: 10, minutes: 10 }
        },
        {
          name: '2nd Period',
          startTime: { hours: 10, minutes: 15 },
          endTime: { hours: 11, minutes: 45 }
        },
        {
          name: 'Lunch',
          startTime: { hours: 11, minutes: 45 },
          endTime: { hours: 12, minutes: 20 }
        },
        {
          name: '3rd Period',
          startTime: { hours: 12, minutes: 25 },
          endTime: { hours: 13, minutes: 55 }
        },
        {
          name: '4th Period',
          startTime: { hours: 14, minutes: 0 },
          endTime: { hours: 15, minutes: 30 }
        }
      ]
    },
    {
      name: 'Tues/Wed (Support Seminar)',
      days: [2, 3],
      classes: [
        {
          name: '1st Period',
          startTime: { hours: 8, minutes: 25 },
          endTime: { hours: 9, minutes: 47 }
        },
        {
          name: 'TSCT',
          startTime: { hours: 9, minutes: 47 },
          endTime: { hours: 9, minutes: 57 }
        },
        {
          name: 'Support Seminar',
          startTime: { hours: 10, minutes: 2 },
          endTime: { hours: 10, minutes: 34 }
        },
        {
          name: '2nd Period',
          startTime: { hours: 10, minutes: 39 },
          endTime: { hours: 12, minutes: 1 }
        },
        {
          name: 'Lunch',
          startTime: { hours: 12, minutes: 1 },
          endTime: { hours: 12, minutes: 36 }
        },
        {
          name: '3rd Period',
          startTime: { hours: 12, minutes: 41 },
          endTime: { hours: 14, minutes: 3 }
        },
        {
          name: '4th Period',
          startTime: { hours: 14, minutes: 8 },
          endTime: { hours: 15, minutes: 30 }
        }
      ]
    }
  ]
}
