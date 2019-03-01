import { Schedule, Time, Period } from "../@types/scheduledata";

class Helpers {
    /**
     * Compares the hours and minutes of two times, aassuming all times occoured on the same day
     *
     * @param {*} time1
     * @param {*} time2
     * @returns -1 if time1 is before time2, 0 if they are the same, 1 if time1 is after time2
     */
    static compareTimes = ( timeObject1:Time, timeObject2:Time ) => {

        let time1 = Helpers.sanitizeTimeObject(timeObject1)
        let time2 = Helpers.sanitizeTimeObject(timeObject2)


        let hoursDiff = time1.hours - time2.hours;
        let minutesDiff = time1.minutes - time2.minutes;
        let secondsDiff= (typeof time1.seconds !== "undefined" && typeof time2.seconds !== "undefined")? time1.seconds - time2.seconds : null

        if (hoursDiff < 0) {return -1}
        else if (hoursDiff > 0) {return 1}

        //hours are the same if execution reaches here

        if (minutesDiff < 0) {return -1}
        else if (minutesDiff > 0) {return 1}

        //hours and minutes are the same if execution reaches here

        if (secondsDiff !== null) {
            if (secondsDiff < 0) {return -1}
            else if (secondsDiff > 0) {return 1}
        }

        //hours, minutes, and seconds are the same if execution reaches here
        return 0
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
    static checkTimeRange = (checkTime:Time, startTime:Time, endTime:Time) => {

        let startCheck = Helpers.compareTimes(checkTime, startTime)
        let endCheck = Helpers.compareTimes(checkTime, endTime)

        if (startCheck === -1) { return -1 }
        else if ( startCheck >= 0 && endCheck <= 0) { return 0 }
        else { return 1 }

    }

    

    /**
     * this gets the absolute value of the difference between the given time and the current time
     *
     * @param {*} time the time that you want to calculate the delta to from the current time
     * @returns the absolute value of the difference between the given time and the current time as an object 
     */
    static getTimeDelta = (timeObject1:Time, timeObject2:Time) => {
                                //arbitrary date. doesnt matter what it is as long as they match
        var time1ms = new Date(2000, 0, 1,  timeObject1.hours, timeObject1.minutes, timeObject1.seconds).getTime();
        var time2ms = new Date(2000, 0, 1, timeObject2.hours, timeObject2.minutes, timeObject2.seconds).getTime();
                                                    //order doesnt matter
        return Helpers.convertMillisecondsToTime(Math.abs(time1ms - time2ms));
    }


    /**
     * this returns a new time object that has been checked for inconsistencies
     * such as omitted or invalid values and corrected
     *
     * @param {*} timeObject the timeObject to validate
     * @returns a new, validated time object
     */
    static sanitizeTimeObject = (timeObject:Time) => {
        
        //this prevents the original object from being modified
        var newTimeObject = timeObject;

        if (newTimeObject.hours === undefined ) { newTimeObject.hours = 0; }
        if (newTimeObject.minutes === undefined ) { newTimeObject.minutes = 0; }
        if (newTimeObject.seconds === undefined ) { newTimeObject.seconds = 0; }
        // if (timeObject.milliseconds === undefined ) { timeObject.milliseconds = 0; }

        //timeObjects are always in 24-hour time
        newTimeObject.hours = newTimeObject.hours % 24;
        newTimeObject.minutes = newTimeObject.minutes % 60;
        newTimeObject.seconds = newTimeObject.seconds % 60;
        // timeObject.milliseconds = timeObject.milliseconds % 1000;
        
        return newTimeObject;
    }


    /**
     * converts a given number of milliseconds into a time object. Used for calculating the time between now and the end of the current class
     *
     * @param {*} milliseconds the number of milliseconds to convert
     * @returns a time object
     */
    static convertMillisecondsToTime = (milliseconds:number) => {
        //theres probably a better way to do this using Date()
        let time = {hours: 0, minutes:0, seconds:0, milliseconds: 0};
        //convert from milliseconds to H:M:S
        time.hours = Math.floor(milliseconds / 1000 / 60 / 60);
        milliseconds -= time.hours * 1000 * 60 * 60;
        time.minutes = Math.floor(milliseconds / 1000 / 60);
        milliseconds -= time.minutes * 1000 * 60;
        time.seconds = Math.floor(milliseconds / 1000);
        milliseconds -= time.seconds * 1000;
        //we dont need milliseconds so ignore this
        //time.milliseconds = milliseconds
        return time
    }


    /**
     * this determines the index of the class period that is currently going on (if any)
     *
     * @returns an index for looking up the current class period, or -1 if there is no class happening right now 
     */
    static getCurrentClassPeriodIndex = (currentSchedule:Schedule, currentDate:Date) => {
        // if (Helpers.isNoSchoolDay(currentSchedule)) {
        //     //return immediately if there is no school today
        //     return -1
        // }

        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < currentSchedule.classes.length; i++) {
            if (Helpers.checkTimeRange(Helpers.getTimeObjectFromTime(currentDate), currentSchedule.classes[i].startTime, currentSchedule.classes[i].endTime) === 0) {
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
    static isNoSchoolDay = (currentScheduleIndex:number) => {
        return currentScheduleIndex <= -1;
        //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
    }

    /**
     * this determines the index of the schedule that applies to today (if any)
     *
     * @returns an index for looking up the current schedule, or -1 if there is no school today
     */
    static getCurrentScheduleIndex = (schedules:Schedule[]) => {
        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i].days.includes(new Date().getDay())) {
                return i
            }
        }
        //if execution reaches here, no schedules were found for today, so it must be a no school day
        return -1
    }

    static getScheduleForDay = (schedules: Schedule[], day: number) => {
        for (let i = 0; i < schedules.length; i++) {
          if (schedules[i].days.includes(day)) {
            return schedules[i]
          }
        }
        return null
    }




    static getClassPeriodForTime = (currentSchedule:Schedule, currentTime:Time, returnIndex=false) => {
        if (currentSchedule == null) {
            //return immediately if there is no school today
            return null
        }

        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < currentSchedule.classes.length; i++) {
            if (Helpers.checkTimeRange(currentTime, currentSchedule.classes[i].startTime, currentSchedule.classes[i].endTime) === 0) {
                return returnIndex ? i : currentSchedule.classes[i]
            }
        }
        return null //no match found, there is no class currently in session
    }


    /**
     *  Gets a boolean value from HTML5 localStorage
     *
     * @param {*} key the key which the value is stored under
     * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
     * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
     */
    static getLocalStorageBoolean = (key:string, unsetDefault=false) => {
        if (localStorage.getItem(key) === null) {
            //key is not set
            return unsetDefault
        } else {
            //this is a better way to to convert the string from localStorage into a boolean for checkbox.checked. https://stackoverflow.com/a/264037
            return (localStorage.getItem(key) === "true")
        }
    }

    /**
     *  Gets a Number from HTML5 LocalStorage
     *
     * @param {*} key the key which the Number is stored under
     * @returns the Number stored at the key if it exists, otherwise undefined.
     */
    static getLocalStorageIndex = (key:string) => {
        if (localStorage.getItem(key) !== null) {
            return (Number(localStorage.getItem(key)))
        } else {
            return undefined;
        }
    }

    /**
     *  converts a time object into a string
     *
     * @param {*} timeObject the time object to convert
     * @param {boolean} [includeSeconds=true] a boolean representing whether seconds should be included in this string (i.e. for a countdown) or not (i.e. for displaying a fixed time)
     * @returns a String in either HH:MM format or HH:MM:SS format
     */
    static getTimeStringFromObject = (timeObject:Time, includeSeconds=true):string => {
        if (typeof timeObject.seconds !== "undefined" && includeSeconds) {
            //you can really tell how much i dont like to duplicate code here haha
            return Helpers.getTimeStringFromObject(timeObject, false) + ":" + timeObject.seconds.toString().padStart(2, '0');
        } else {
            return timeObject.hours.toString().padStart(2, '0') + ":" + timeObject.minutes.toString().padStart(2, '0')
        }
    }


     /**
     *  converts a time object into a formatted time string based on the user's time format (12/24 hour) preferences
     *
     * @param {*} timeObject the time object to convert to a string
     * @returns the string in either 12 or 24 hour format
     */
    static getFormattedTimeStringFromObject = (timeObject:Time) => {
        var pmString = "";
        let use24HourTime = Helpers.getLocalStorageBoolean("use24HourTime");
        //convert to 12 hour if necessary
        if (!use24HourTime && timeObject.hours > 12) {
            timeObject.hours -= 12;
            pmString = " PM";

        } else if (!use24HourTime) {
            pmString = " AM";
        }

        return Helpers.getTimeStringFromObject(timeObject, false) + pmString;
    }

    static getTimeObjectFromTime = (currentDate:Date) => {
        return {hours: currentDate.getHours(), minutes: currentDate.getMinutes(), seconds: currentDate.getSeconds()}
    }

}


export default Helpers