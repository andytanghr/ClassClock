import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    constructor() {
        super();

        this.state={
            time:'',
            date:'',
            scheduleInfoVis: '',
            schedule: '',
            viewScheduleLinkDispl: '',
            selectedSchoolDisplay: '',
            hideLabels: false,


        }

        this.use24HourTime = this.getLocalStorageBoolean("use24HourTime", false);

        this.update();
      }

    DAY_OFF_FLAG = "day off";
    OUTSIDE_SCHOOL_HOURS_FLAG = "outside school hours";
    SCHOOL_IN_CLASS_OUT_FLAG = "school is in session, but class is not";
    CLASS_IN_SESSION_FLAG = "class is in session"
  
    FLASH_SUCCESS = "SUCCESS"
    FLASH_INFO = "INFO"
    FLASH_WARN = "WARNING"
    FLASH_DANGER = "DANGER"
  
    currentDate;
  
    currentClassPeriodIndex = -1;
      //nextClassPeriodIndex
  
    currentScheduleIndex = -1;
    selectedSchoolIndex = 0;
  
  
    use24HourTime;




    schools = [
          {
          fullName: "Lake Oswego High School",
          shortName: "LOHS",
          passingPeriodName: "Passing Period", //the name to use for time gaps in the schedule between classes
          //order is as is on the school website, although it doesnt matter.
          schedules: [
              {
                  name: "Mon/Fri (Regular)",
                  days: [1, 5],
                  classes: [
                      {
                          name: "1st Period",
                          startTime: {hours: 8, minutes:25},
                          endTime: {hours: 9, minutes:55}
                      },
                      {
                          name: "TSCT",
                          startTime: {hours: 9, minutes:55},
                          endTime: {hours: 10, minutes:10}
                      },
                      {
                          name: "2nd Period",
                          startTime: {hours: 10, minutes:15},
                          endTime: {hours: 11, minutes:45}
                      },
                      {
                          name: "Lunch",
                          startTime: {hours: 11, minutes:45},
                          endTime: {hours: 12, minutes:20}
                      },
                      {
                          name: "3rd Period",
                          startTime: {hours: 12, minutes:25},
                          endTime: {hours: 13, minutes:55}
                      },
                      {
                          name: "4th Period",
                          startTime: {hours: 14, minutes:0},
                          endTime: {hours: 15, minutes:30}
                      }
                  ]
              },
              {
                  name: "Tues/Wed (Support Seminar)",
                  days: [2, 3],
                  classes: [
                      {
                          name: "1st Period",
                          startTime: {hours: 8, minutes:25},
                          endTime: {hours: 9, minutes:47}
                      },
                      {
                          name: "TSCT",
                          startTime: {hours: 9, minutes:47},
                          endTime: {hours: 9, minutes:57}
                      },
                      {
                          name: "Support Seminar",
                          startTime: {hours: 10, minutes:2},
                          endTime: {hours: 10, minutes:34}
                      },
                      {
                          name: "2nd Period",
                          startTime: {hours: 10, minutes:39},
                          endTime: {hours: 12, minutes:1}
                      },
                      {
                          name: "Lunch",
                          startTime: {hours: 12, minutes:1},
                          endTime: {hours: 12, minutes:36}
                      },
                      {
                          name: "3rd Period",
                          startTime: {hours: 12, minutes:41},
                          endTime: {hours: 14, minutes:3}
                      },
                      {
                          name: "4th Period",
                          startTime: {hours: 14, minutes:8},
                          endTime: {hours: 15, minutes:30}
                      }
                  ],
              },
              {
                  name: "Thursday (Early Release)",
                  days: [4],
                  classes: [
                      {
                          name: "1st Period",
                          startTime: {hours: 8, minutes:25},
                          endTime: {hours: 9, minutes:50}
                      },
                      {
                          name: "TSCT",
                          startTime: {hours: 9, minutes:50},
                          endTime: {hours: 10, minutes:0}
                      },
                      {
                          name: "2nd Period",
                          startTime: {hours: 10, minutes:5},
                          endTime: {hours: 11, minutes:30}
                      },
                      {
                          name: "Lunch",
                          startTime: {hours: 11, minutes:30},
                          endTime: {hours: 12, minutes:5}
                      },
                      {
                          name: "3rd Period",
                          startTime: {hours: 12, minutes:10},
                          endTime: {hours: 13, minutes:35}
                      },
                      {
                          name: "4th Period",
                          startTime: {hours: 13, minutes:40},
                          endTime: {hours: 15, minutes:5}
                      }
                  ]
              }
          ]
      }
  ];

  
   
    

    /**
     * The standard run loop for updating the time and other time-related information on the site.
     *
     */
    update = () => {
        this.updateTime();
        this.setState({time: this.getCurrentTimeString()});
        this.setState({date: this.getCurrentDateString()});


        if (typeof this.selectedSchoolIndex !== 'undefined') {
            this.updateVariables()
            this.updateText();
            this.setState({scheduleInfoVis: "visible"});
            
        } else {
            this.setstate({scheduleInfoVis: "hidden"});
        }
        
        setTimeout(this.update, 500);
    }

    /**
     * mostly useless method to update the currentScheduleIndex and currentClassPeriodIndex
     */
    updateVariables = () => {
        this.currentScheduleIndex = this.getCurrentScheduleIndex();
        this.currentClassPeriodIndex = this.getCurrentClassPeriodIndex();
    }

    /**
     * Updates labels on the homepage
     */
    updateText = () => {

        if (this.getCurrentTimeState() !== this.DAY_OFF_FLAG ) {

            this.setState({schedule: ["You are viewing the ", <strong>{this.getCurrentScheduleName()}</strong>, " schedule"]});
            this.setState({selectedSchoolDisplay: ["from ", <strong>{this.schools[this.selectedSchoolIndex].fullName}</strong> ,"."]});

            this.setState({viewScheduleLinkDispl: "block"});
        }


        switch (this.getCurrentTimeState()) {
            case this.DAY_OFF_FLAG:
            this.setState({schedule: ["There's ", <strong>no class</strong>, " today!" ]});
            this.setState({viewScheduleLink: "none" });

                
            this.setState({hideLabels: true});
            // let labels = document.getElementsByClassName("label")
            //     for (let i = 0; i < labels.length; i++ ) {
            //         labels[i].style.display = "none";
            //     }

                
                break;

            case this.OUTSIDE_SCHOOL_HOURS_FLAG:

                if(this.compareTimes(this.getCurrentTimeObject(), this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[0].startTime) === -1) {
                    this.setState({countdownLabel: "School starts in: " });
                    this.setState({timeToEndOfClass: this.getTimeToStartOfSchoolString() });
                } else {
                    this.setState({timeToEndOfClass: "No Class" });
                }

                this.setState({nextClass: this.getClassName(this.currentClassPeriodIndex+1) });
                this.setState({currentClass: this.getClassName(this.currentClassPeriodIndex) });
                
                break;

            case this.SCHOOL_IN_CLASS_OUT_FLAG:
                

            this.setState({nextClass: this.getClassName(this.getMostRecentlyStartedClassIndex()+1) });
            this.setState({currentClass: this.schools[this.selectedSchoolIndex].passingPeriodName });
            this.setState({timeToEndOfClass: this.getTimeStringFromObject(this.getTimeTo(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[this.getMostRecentlyStartedClassIndex()+1].startTime)) });
                break;

            case this.CLASS_IN_SESSION_FLAG:
            this.setState({countdownLabel:  "...which ends in: " });
            this.setState({timeToEndOfClass: this.getTimeStringFromObject(this.getTimeTo(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[this.getCurrentClassPeriodIndex()].endTime)) });

            this.setState({nextClass: this.getClassName(this.currentClassPeriodIndex+1) });
            this.setState({currentClass: this.getClassName(this.currentClassPeriodIndex) });
                break;

            default:


        }

    }


    /**
     * @returns a flag that represents the current chunk of time categorically
     */
    getCurrentTimeState = () => {

        //there is no schedule that applies today
        if (this.getCurrentScheduleIndex() <= -1) { return this.DAY_OFF_FLAG }

        //it is a school day but it is not school hours
        else if (!this.schoolIsInSession()) { return this.OUTSIDE_SCHOOL_HOURS_FLAG }
        
        //the current time lies between the start of the first schedules class and the end of the last
        else if (this.schoolIsInSession() && !this.classIsInSession()) { return this.SCHOOL_IN_CLASS_OUT_FLAG }

        //the current time lies within a scheduled class period
        else if (this.classIsInSession()) { return this.CLASS_IN_SESSION_FLAG }


    }

    /**
     * @returns the current schedule name or "No School" if there is no school scheduled today
     */
    getCurrentScheduleName = () => {
        if (!this.isNoSchoolDay()) {
            return this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].name
        } else { return "No School"}
    }

    /**
     * this checks to see if the currentClassPeriodIndex is valid (greater than -1), indicating that there is currently a scheduled class period happening
     *
     * @returns a boolean representing if class is in session
     */
    classIsInSession = () => {
        return (this.currentClassPeriodIndex >= 0 && !this.isNoSchoolDay())
        //might later want to add a check to make sure that currentClassPeriodIndex is not greater than the number of classes in the schedule for today
    }

    /**
     * this checks to see if the current time is between the start of the first scheduled class and the end of the last scheduled class. This indicates that school is currently in session
     *
     * @returns a boolean representing if school is in session
     */
    schoolIsInSession = () => {

        return this.checkTimeRange(
            this.getCurrentTimeObject(),
            this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[0].startTime,
            this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes.length-1].endTime
            ) === 0
    }

    /**
     *  this checks to see if the currentScheduleIndex is valid (greater than -1), indicating that there is a schedule for the day
     *
     * @returns true if there is no schedule that applies to today, false if there is
     */
    isNoSchoolDay = () => {
        return this.currentScheduleIndex <= -1;
        //might later want to add a check to make sure that currentScheduleIndex is not greater than the number of schedules
    }


    /**
     * This updates the variables that keep track of the current time and date
     */
    updateTime = () => { this.currentDate = new Date();}

    getCurrentTimeObject = () => {
    return {hours: this.currentDate.getHours(), minutes: this.currentDate.getMinutes(), seconds: this.currentDate.getSeconds()}
    }
    

    /**
     * @returns the current time as a formatted string
     */
    getCurrentTimeString = () => { return this.currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: !this.use24HourTime }) }

    /**
     * @returns the current date as a formatted string
     */
    getCurrentDateString = () => { 
    return ["on", <strong> {this.currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) } </strong>]
    }

    /**
     * this determines the index of the class period that is currently going on (if any)
     *
     * @returns an index for looking up the current class period, or -1 if there is no class happening right now 
     */
    getCurrentClassPeriodIndex = () => {
        if (this.isNoSchoolDay()) {
            //return immediately if there is no school today
            return -1
        }

        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes.length; i++) {
            if (this.checkClassTime(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i]) === 0) {
                return i
                //break;//not sure if this is necessary so I included it anyway
            }
        }
        return -1 //no match found, there is no class currently in session
    }



    /**
     * @returns the index of the class that started most recently
     */
    getMostRecentlyStartedClassIndex = () => {

        if (this.isNoSchoolDay()) {
            //return immediately if there is no school today
            return -1
        }

        
        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes.length; i++) {
            let classPeriodStatus = this.checkClassTime(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i])
            let nextClassPeriodStatus;
            if (i+1 < this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes.length) {
                nextClassPeriodStatus = this.checkClassTime(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i+1])
            }

            if (classPeriodStatus === -1) {
                //class hasnt started, do nothing
            } else if (classPeriodStatus === 0 ){
                //class is currently in session, return index
                return i
            } else if (classPeriodStatus === 1 && (typeof nextClassPeriodStatus !== "undefined" && nextClassPeriodStatus === -1)) {
                //class has passed and next class hasnt started (indicating a passing period)
                //return the class index
                return i
            }
        }

    }


    /**
     * this determines the index of the schedule that applies to today (if any)
     *
     * @returns an index for looking up the current schedule, or -1 if there is no school today
     */
    getCurrentScheduleIndex = () => {
        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < this.schools[this.selectedSchoolIndex].schedules.length; i++) {
            if (this.schools[this.selectedSchoolIndex].schedules[i].days.includes(this.currentDate.getDay())) {
                return i
            }
        }
        //if execution reaches here, no schedules were found for today, so it must be a no school day
        return -1
    }


    /**
     * Compares the hours and minutes of two times, aassuming all times occoured on the same day
     *
     * @param {*} time1
     * @param {*} time2
     * @returns -1 if time1 is before time2, 0 if they are the same, 1 if time1 is after time2
     */
    compareTimes = ( timeObject1, timeObject2 ) => {

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
    checkTimeRange = (checkTime, startTime, endTime) => {

        let startCheck = this.compareTimes(checkTime, startTime)
        let endCheck = this.compareTimes(checkTime, endTime)

        if (startCheck === -1) { return -1 }
        else if ( startCheck >= 0 && endCheck <= 0) { return 0 }
        else { return 1 }

    }

    checkClassTime = (classPeriod) => {
        return this.checkTimeRange(this.getCurrentTimeObject(), classPeriod.startTime, classPeriod.endTime)
    }

    /**
     * this gets the absolute value of the difference between the given time and the current time
     *
     * @param {*} time the time that you want to calculate the delta to from the current time
     * @returns the absolute value of the difference between the given time and the current time as an object 
     */
    getTimeDelta = (timeObject1, timeObject2) => {
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
    sanitizeTimeObject = (timeObject) => {
        
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
    convertMillisecondsToTime = (milliseconds) => {
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
     * This fucntion is used for calculating how long until school starts
     * @returns the time to the start of school as a string
     */
    getTimeToStartOfSchoolString = () => {
        if (!this.classIsInSession() && !this.isNoSchoolDay() && this.compareTimes(this.getCurrentTimeObject(), this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[0].startTime) === -1) {
            return this.getTimeStringFromObject(this.getTimeTo(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[0].startTime));
        } else {
            return "No Class"
        }
    }


    /**
     * A shortcut that inserts the current time into getTimeDelta() for convenience
     *
     * @param {*} timeObject
     * @returns
     */
    getTimeTo = (timeObject) => {
        return this.getTimeDelta(this.getCurrentTimeObject(), timeObject)
    }

    /**
     *  converts a time object into a string
     *
     * @param {*} timeObject the time object to convert
     * @param {boolean} [includeSeconds=true] a boolean representing whether seconds should be included in this string (i.e. for a countdown) or not (i.e. for displaying a fixed time)
     * @returns a String in either HH:MM format or HH:MM:SS format
     */
    getTimeStringFromObject = (timeObject, includeSeconds=true) => {
        if (includeSeconds) {
            //you can really tell how much i dont like to duplicate code here haha
            return this.getTimeStringFromObject(timeObject, false) + ":" + timeObject.seconds.toString().padStart(2, '0');
        } else {
            return timeObject.hours.toString().padStart(2, '0') + ":" + timeObject.minutes.toString().padStart(2, '0')
        }
    }

    /**
     *
     * @param {*} index the index of the class to return the name for
     * @returns returns the class name for the given index or "No Class" if there is no class in session
     */
    getClassName = (index) => {
        var classes = this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes;
        
        if (index >= 0 && index < classes.length) {
                return classes[index].name.toString()
        } else {
            return "No Class"
        }
    }



    /**
     * this for populating the table on the schedule page
     *
     */
    populateScheduleTable = () => {
        // var body = document.getElementsByTagName('body')[0];
        var tbl = document.getElementById("scheduleTable")//createElement('table');
        // tbl.style.width = '100%';
        //tbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');

            for (var i = 0; i < this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes.length; i++) {
                if (this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i].showInFullSchedule !== false) {
                var tr = document.createElement('tr');
                //for (var j = 0; j < 3; j++) {

                    var td = document.createElement('td');
                    td.innerHTML = this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i].name;
                    td.style.fontWeight = "bold";
                    //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
                    tr.appendChild(td)

                    var td2 = document.createElement('td');
                    td2.innerHTML = this.getFormattedTimeStringFromObject(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i].startTime) + " - " + this.getFormattedTimeStringFromObject(this.schools[this.selectedSchoolIndex].schedules[this.currentScheduleIndex].classes[i].endTime)
                    //td.appendChild(document.createTextNode(data.schedules[currentScheduleIndex].classes[i].name))
                    tr.appendChild(td2);

                // }
                tbdy.appendChild(tr);
            }
        }
        tbl.appendChild(tbdy);
    // body.appendChild(tbl)
    }


    /**
     *  converts a time object into a formatted time string based on the user's time format (12/24 hour) preferences
     *
     * @param {*} timeObject the time object to convert to a string
     * @returns the string in either 12 or 24 hour format
     */
    getFormattedTimeStringFromObject = (timeObject) => {
        var pmString = "";

        //convert to 12 hour if necessary
        if (!this.use24HourTime && timeObject.hours > 12) {
            timeObject.hours -= 12;
            pmString = " PM";

        } else if (!this.use24HourTime) {
            pmString = " AM";
        }

        return this.getTimeStringFromObject(timeObject, false) + pmString;
    }

    /**
     *  Gets a boolean value from HTML5 localStorage
     *
     * @param {*} key the key which the value is stored under
     * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
     * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
     */
    getLocalStorageBoolean = (key, unsetDefault=false) => {
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
    getLocalStorageIndex = (key) => {
        if (localStorage.getItem(key) !== null) {
            return (Number(localStorage.getItem(key)))
        } else {
            return undefined;
        }
    }

    /**
     * Causes a message to be displayed to the user.
     * This is useful for displaying error or succcess messages or otherwise warning users about something that may impact their use of classclock
     *
     * @param {*} message the text of the message to display to the user
     * @param {*} [type=FLASH_INFO] the flag of the style to use when displaying the message. Default: INFO
     * @param {number} [timeout=5000] the mumber of milliseconds to wait before the message disappears again. Anything less than 1 will disable the timeout
     */
    flashMessage = (message, type = this.FLASH_INFO, timeout = 5000) => {
        let flash = document.getElementById("flash")

        flash.innerHTML = message;
        // flash.style.visibility = "visible";
        flash.style.display = "normal";

        switch (type) {
            case this.FLASH_SUCCESS:
                flash.className = "success"; 
                break;

            case this.FLASH_WARN:
                flash.className = "warning";
                break;
                
            case this.FLASH_DANGER:
                flash.className = "danger";
                break;

            default: //FLASH_INFO
                flash.className = "info";
        }
        // maybe animate down or fade in

        if (timeout > 0) {
            setTimeout( function remove() {
                // flash.style.visibility = "hidden";
                flash.style.display = "none";
            }, timeout)
        }

    }

    // var a=document.getElementsByTagName("a");
    //     for(var i=0;i<a.length;i++)
    //     {
    //         if (a[i].classList.contains("navbutton")) {
    //             a[i].onclick=function()
    //             {
    //                 window.location=this.getAttribute("href");
    //                 return false
    //             }
    //         }
    //     }


    render() {
        return (
            <div className="App">
                <a className="navbutton" href="settings.html"><i className="fas fa-cog"></i></a>
                <br />
                <p className="centered">It is currently: </p>
                <h1 className="centered time" id="time">{this.state.time}</h1>
                <p className="centered bottomSpace" id="date">{this.state.date}</p>

                <section id="scheduleInfo" className="verticalFlex">

                    <p className="centered" id="schedule">{this.state.schedule}</p>
                    <p className="centered" id="selectedSchoolDisplay">{this.state.selectedSchoolDisplay}</p>
                    <a href="schedule.html" className="centered bottomSpace" id="viewScheduleLink">View Schedule</a>

                    <p className="centered label">You are currently in: </p>
                    <h1 className="centered bottomSpace" id="currentClass">{this.state.currentClass}</h1>

                    <p className="centered label" id="countdownLabel">...which ends in: </p>
                    <h1 className="centered bottomSpace time bigger" id="timeToEndOfClass">{this.state.timeToEndOfClass}</h1>

                    <p className="centered label">Your next class period is: </p>
                    <h1 className="centered bottomSpace" id="nextClass">{this.state.nextClass}</h1>

                </section>
            </div>
        );
    }
}

export default App;
        