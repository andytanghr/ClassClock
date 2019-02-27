class Helpers {
    /**
     * Compares the hours and minutes of two times, aassuming all times occoured on the same day
     *
     * @param {*} time1
     * @param {*} time2
     * @returns -1 if time1 is before time2, 0 if they are the same, 1 if time1 is after time2
     */
    static compareTimes = ( timeObject1, timeObject2 ) => {

        let time1 = this.sanitizeTimeObject(timeObject1)
        let time2 = this.sanitizeTimeObject(timeObject2)


        let hoursDiff = time1.hours - time2.hours;
        let minutesDiff = time1.minutes - time2.minutes;
        let secondsDiff = time1.seconds - time2.seconds;

        if (hoursDiff < 0) {return -1}
        else if (hoursDiff > 0) {return 1}

        //hours are the same if execution reaches here

        if (minutesDiff < 0) {return -1}
        else if (minutesDiff > 0) {return 1}

        //hours and minutes are the same if execution reaches here

        if (secondsDiff < 0) {return -1}
        else if (secondsDiff > 0) {return 1}

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
    static checkTimeRange = (checkTime, startTime, endTime) => {

        let startCheck = this.compareTimes(checkTime, startTime)
        let endCheck = this.compareTimes(checkTime, endTime)

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
    static getTimeDelta = (timeObject1, timeObject2) => {
        var time1 = new Date(2000, 0, 1,  timeObject1.hours, timeObject1.minutes, timeObject1.seconds);
        var time2 = new Date(2000, 0, 1, timeObject2.hours, timeObject2.minutes, timeObject2.seconds);
        
                                                    //order doesnt matter
        return this.convertMillisecondsToTime(Math.abs(time1 - time2));
    }


    /**
     * this returns a new time object that has been checked for inconsistencies
     * such as omitted or invalid values and corrected
     *
     * @param {*} timeObject the timeObject to validate
     * @returns a new, validated time object
     */
    static sanitizeTimeObject = (timeObject) => {
        
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
    static convertMillisecondsToTime = (milliseconds) => {
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
     *  Gets a boolean value from HTML5 localStorage
     *
     * @param {*} key the key which the value is stored under
     * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
     * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
     */
    static getLocalStorageBoolean = (key, unsetDefault=false) => {
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
    static getLocalStorageIndex = (key) => {
        if (localStorage.getItem(key) !== null) {
            return (Number(localStorage.getItem(key)))
        } else {
            return undefined;
        }
    }

}


export default Helpers