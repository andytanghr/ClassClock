import React, { Component } from 'react';
import Helpers from "./Helpers";
import '../App.css';

class Main extends Component {

    
    constructor(props) {
        super(props);

        this.state={
            time:'',
            date:'',
            scheduleInfoVis: '',
            schedule: '',
            viewScheduleLinkDispl: '',
            selectedSchoolDisplay: '',
            hideLabels: false,


        }

        this.use24HourTime = Helpers.getLocalStorageBoolean("use24HourTime", false);

        this.schools = this.props.schools;
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



    schools;





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
        this.currentScheduleIndex = this.getCurrentScheduleIndex(this.schools[this.selectedSchoolIndex].schedules);
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
        if (this.getCurrentScheduleIndex(this.schools[this.selectedSchoolIndex].schedules) <= -1) { return this.DAY_OFF_FLAG }

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

        return Helpers.checkTimeRange(
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
    getCurrentScheduleIndex = (schedules) => {
        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i].days.includes(new Date().getDay())) {
                return i
            }
        }
        //if execution reaches here, no schedules were found for today, so it must be a no school day
        return -1
    }


    checkClassTime = (classPeriod) => {
        return Helpers.checkTimeRange(this.getCurrentTimeObject(), classPeriod.startTime, classPeriod.endTime)
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
        return Helpers.getTimeDelta(this.getCurrentTimeObject(), timeObject)
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
                <a className="navbutton" href="settings"><i className="fas fa-cog"></i></a>
                <br />
                <p className="centered">It is currently: </p>
                <h1 className="centered time" id="time">{this.state.time}</h1>
                <p className="centered bottomSpace" id="date">{this.state.date}</p>

                <section id="scheduleInfo" className="verticalFlex">

                    <p className="centered" id="schedule">{this.state.schedule}</p>
                    <p className="centered" id="selectedSchoolDisplay">{this.state.selectedSchoolDisplay}</p>
                    <a href="schedule" className="centered bottomSpace" id="viewScheduleLink">View Schedule</a>

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

export default Main;