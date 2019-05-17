import { Schedule, Time, Period } from '../@types/scheduleData'
import { TimeTense } from './enums'
import { Moment } from 'moment'

export function compareTimes (timeObject1: Time, timeObject2: Time) {
  let time1 = sanitizeTimeObject(timeObject1)
  let time2 = sanitizeTimeObject(timeObject2)

  let hoursDiff = time1.hours - time2.hours
  let minutesDiff = time1.minutes - time2.minutes
  let secondsDiff =
    typeof time1.seconds !== 'undefined' && typeof time2.seconds !== 'undefined'
      ? time1.seconds - time2.seconds
      : null

  if (hoursDiff < 0) {
    return TimeTense.before
  } else if (hoursDiff > 0) {
    return TimeTense.after
  }

  //hours are the same if execution reaches here

  if (minutesDiff < 0) {
    return TimeTense.before
  } else if (minutesDiff > 0) {
    return TimeTense.after
  }

  //hours and minutes are the same if execution reaches here

  if (secondsDiff !== null) {
    if (secondsDiff < 0) {
      return TimeTense.before
    } else if (secondsDiff > 0) {
      return TimeTense.after
    }
  }

  //hours, minutes, and seconds are the same if execution reaches here
  return TimeTense.now
}

/**
 * This checks if the current time is between the two given times
 * This is useful for checking which class period you are currently in or for checking if school is in session.
 *
 * @param {*} checkTime the time that the check results are returned for
 * @param {*} startTime the start time of the range to check
 * @param {*} endTimethe the end time of the range to check
 *
 * @returns -1 if checkTime is before range, 0 if checkTime is within range, 1 if checkTime is after range
 */
export function checkTimeRange (
  checkTime: Time,
  startTime: Time,
  endTime: Time
) {
  let startCheck = compareTimes(checkTime, startTime)
  let endCheck = compareTimes(checkTime, endTime)

  if (startCheck === TimeTense.before) {
    return TimeTense.before
  } else if (startCheck === TimeTense.after && endCheck === TimeTense.before) {
    return TimeTense.now
  } else {
    return TimeTense.after
  }
}

/**
 * this gets the absolute value of the difference between the given time and the current time
 *
 * @param {*} time the time that you want to calculate the delta to from the current time
 * @returns the absolute value of the difference between the given time and the current time as an object
 */
export function getTimeDelta (timeObject1: Time, timeObject2: Time) {
  var time1ms = new Date(
    2000,
    0,
    1,
    timeObject1.hours,
    timeObject1.minutes,
    timeObject1.seconds
  ).getTime()
  var time2ms = new Date(
    2000,
    0,
    1,
    timeObject2.hours,
    timeObject2.minutes,
    timeObject2.seconds
  ).getTime()

  return convertMillisecondsToTime(Math.abs(time1ms - time2ms))
}

/**
 * this returns a new time object that has been checked for inconsistencies
 * such as omitted or invalid values and corrected
 *
 * @param {*} timeObject the timeObject to validate
 * @returns a new, validated time object
 */
export function sanitizeTimeObject (timeObject: Time) {
  //this prevents the original object from being modified
  var newTimeObject = timeObject

  if (newTimeObject.hours === undefined) {
    newTimeObject.hours = 0
  }
  if (newTimeObject.minutes === undefined) {
    newTimeObject.minutes = 0
  }
  if (newTimeObject.seconds === undefined) {
    newTimeObject.seconds = 0
  }
  // if (timeObject.milliseconds === undefined ) { timeObject.milliseconds = 0; }

  //timeObjects are always in 24-hour time
  newTimeObject.hours = newTimeObject.hours % 24
  newTimeObject.minutes = newTimeObject.minutes % 60
  newTimeObject.seconds = newTimeObject.seconds % 60
  // timeObject.milliseconds = timeObject.milliseconds % 1000;

  return newTimeObject
}

/**
 * converts a given number of milliseconds into a time object. Used for calculating the time between now and the end of the current class
 *
 * @param {*} milliseconds the number of milliseconds to convert
 * @returns a time object
 */
export function convertMillisecondsToTime (milliseconds: number): Time {
  //theres probably a better way to do this using Date()
  let time = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
  //convert from milliseconds to H:M:S
  time.hours = Math.floor(milliseconds / 1000 / 60 / 60)
  milliseconds -= time.hours * 1000 * 60 * 60
  time.minutes = Math.floor(milliseconds / 1000 / 60)
  milliseconds -= time.minutes * 1000 * 60
  time.seconds = Math.floor(milliseconds / 1000)
  milliseconds -= time.seconds * 1000
  //we dont need milliseconds so ignore this
  //time.milliseconds = milliseconds
  return time
}

/**
 * this determines the index of the class period that is currently going on (if any)
 *
 * @returns an index for looking up the current class period, or -1 if there is no class happening right now
 */
export function getCurrentClassPeriodIndex (
  currentSchedule: Schedule,
  currentDate: Date
) {
  // if (export constisNoSchoolDay(currentSchedule)) {
  //     //return immediately if there is no school today
  //     return -1
  // }

  //using for over forEach() because we are breaking out of the loop early
  for (let i = 0; i < currentSchedule.classes.length; i++) {
    if (
      checkTimeRange(
        getTimeObjectFromTime(currentDate),
        currentSchedule.classes[i].startTime,
        currentSchedule.classes[i].endTime
      ) === 0
    ) {
      return i
    }
  }
  return -1 //no match found, there is no class currently in session
}

/**
 *  this checks to see if the currentScheduleIndex is valid (greater than -1), indicating that there is a schedule for the day
 *
 * @returns true if there is no schedule that applies to today, false if there is
 */
export function isNoSchoolDay (currentScheduleIndex: number) {
  return currentScheduleIndex <= -1
  //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
}

export function getSchedule (schedules: Schedule[], weekday: number) {
  for (let i = 0; i < schedules.length; i++) {
    if (schedules[i].days.includes(weekday)) {
      return schedules[i]
    }
  }

  return undefined
}

export function getUpcomingClasses (schedule: Schedule, time: Moment) {
  let current = {
    hours: time.hour(),
    minutes: time.minute(),
    seconds: time.second()
  } as Time

  for (let i = 0; i < schedule.classes.length; i++) {
    if (
      checkTimeRange(
        current,
        schedule.classes[i].startTime,
        schedule.classes[i].endTime
      ) === TimeTense.now
    ) {
      let nextClass
      if (i + 1 < schedule.classes.length) {
        nextClass = schedule.classes[i + 1]
      }
      return {
        currentClass: schedule.classes[i],
        nextClass
      }
    }
  }
  return undefined
}

/**
 *  Gets a boolean value from HTML5 localStorage
 *
 * @param {*} key the key which the value is stored under
 * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
 * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
 */
export function getLocalStorageBoolean (key: string, unsetDefault = false) {
  if (localStorage.getItem(key) === null) {
    //key is not set
    return unsetDefault
  } else {
    //this is a better way to to convert the string from localStorage into a boolean for checkbox.checked. https://stackoverflow.com/a/264037
    return localStorage.getItem(key) === 'true'
  }
}

/**
 *  Gets a Number from HTML5 LocalStorage
 *
 * @param {*} key the key which the Number is stored under
 * @returns the Number stored at the key if it exists, otherwise undefined.
 */
export function getLocalStorageIndex (key: string) {
  if (localStorage.getItem(key) !== null) {
    return Number(localStorage.getItem(key))
  } else {
    return undefined
  }
}

/**
 *  converts a time object into a string
 *
 * @param {*} timeObject the time object to convert
 * @param {boolean} [includeSeconds=true] a boolean representing whether seconds should be included in this string (i.e. for a countdown) or not (i.e. for displaying a fixed time)
 * @returns a String in either HH:MM format or HH:MM:SS format
 */
export function getTimeStringFromObject (
  timeObject: Time,
  includeSeconds = true
): string {
  if (typeof timeObject.seconds !== 'undefined' && includeSeconds) {
    //you can really tell how much i dont like to duplicate code here haha
    return (
      getTimeStringFromObject(timeObject, false) +
      ':' +
      timeObject.seconds.toString().padStart(2, '0')
    )
  } else {
    return (
      timeObject.hours.toString().padStart(2, '0') +
      ':' +
      timeObject.minutes.toString().padStart(2, '0')
    )
  }
}

/**
 *  converts a time object into a formatted time string based on the user's time format (12/24 hour) preferences
 *
 * @param {*} timeObject the time object to convert to a string
 * @returns the string in either 12 or 24 hour format
 */
export function getFormattedTimeStringFromObject (timeObject: Time) {
  var pmString = ''
  let use24HourTime = getLocalStorageBoolean('use24HourTime')
  //convert to 12 hour if necessary
  if (!use24HourTime && timeObject.hours > 12) {
    timeObject.hours -= 12
    pmString = ' PM'
  } else if (!use24HourTime) {
    pmString = ' AM'
  }

  return getTimeStringFromObject(timeObject, false) + pmString
}

export function getTimeObjectFromTime (currentDate: Date): Time {
  return {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds()
  }
}
