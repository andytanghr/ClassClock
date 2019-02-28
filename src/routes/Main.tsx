import React, { Component } from 'react';
import Helpers from "../utils/Helpers";
import '../App.css';
import { School, Time } from '../@types/scheduledata';

interface IndexState {
    time?: string
    date?: any
    scheduleInfoVis?: string
    schedule?: any
    viewScheduleLinkDispl?: string
    selectedSchoolDisplay?: any
    hideLabels?: boolean
    countdownLabel?: string
    nextClass?: string
    currentClass?: string
    timeToEndOfClass?: string


  }

class Main extends Component<{school: School}, IndexState> {

    
    constructor(props: any) {
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
        this.currentDate = new Date();

        this.school = this.props.school;
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

    currentDate: Date;

    currentClassPeriodIndex = -1;
    //nextClassPeriodIndex

    currentScheduleIndex = -1;
    selectedSchoolIndex = 0;


    use24HourTime: boolean;



    school: School;





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
            this.setState({scheduleInfoVis: "hidden"});
        }
        
        setTimeout(this.update, 500);
    }

    /**
     * mostly useless method to update the currentScheduleIndex and currentClassPeriodIndex
     */
    updateVariables = () => {
        this.currentScheduleIndex = Helpers.getCurrentScheduleIndex(this.school.schedules);
        this.currentClassPeriodIndex = Helpers.getCurrentClassPeriodIndex(this.school.schedules[this.currentScheduleIndex], this.currentDate);
    }

    /**
     * Updates labels on the homepage
     */
    updateText = () => {

        if (this.getCurrentTimeState() !== this.DAY_OFF_FLAG ) {

            this.setState({schedule: ["You are viewing the ", <strong>{this.getCurrentScheduleName()}</strong>, " schedule"]});
            this.setState({selectedSchoolDisplay: ["from ", <strong>{this.school.fullName}</strong> ,"."]});

            this.setState({viewScheduleLinkDispl: "block"});
        }


        switch (this.getCurrentTimeState()) {
            case this.DAY_OFF_FLAG:
            this.setState({schedule: ["There's ", <strong>no class</strong>, " today!" ]});
            this.setState({viewScheduleLinkDispl: "none" });

                
            this.setState({hideLabels: true});
            // let labels = document.getElementsByClassName("label")
            //     for (let i = 0; i < labels.length; i++ ) {
            //         labels[i].style.display = "none";
            //     }

                
                break;

            case this.OUTSIDE_SCHOOL_HOURS_FLAG:

                if(Helpers.compareTimes(Helpers.getTimeObjectFromTime(this.currentDate), this.school.schedules[this.currentScheduleIndex].classes[0].startTime) === -1) {
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
            this.setState({currentClass: this.school.passingPeriodName });
            this.setState({timeToEndOfClass: Helpers.getTimeStringFromObject(this.getTimeTo(this.school.schedules[this.currentScheduleIndex].classes[this.getMostRecentlyStartedClassIndex()+1].startTime)) });
                break;

            case this.CLASS_IN_SESSION_FLAG:
            this.setState({countdownLabel:  "...which ends in: " });
            this.setState({timeToEndOfClass: Helpers.getTimeStringFromObject(this.getTimeTo(this.school.schedules[this.currentScheduleIndex].classes[Helpers.getCurrentClassPeriodIndex(this.school.schedules[this.currentScheduleIndex], this.currentDate)].endTime)) });

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
        if (Helpers.getCurrentScheduleIndex(this.school.schedules) <= -1) { return this.DAY_OFF_FLAG }

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
    getCurrentScheduleName = ():string => {
        if (!Helpers.isNoSchoolDay(this.currentScheduleIndex)) {
            return this.school.schedules[this.currentScheduleIndex].name
        } else { return "No School"}
    }

    /**
     * this checks to see if the currentClassPeriodIndex is valid (greater than -1), indicating that there is currently a scheduled class period happening
     *
     * @returns a boolean representing if class is in session
     */
    classIsInSession = ():boolean => {
        return (this.currentClassPeriodIndex >= 0 && !Helpers.isNoSchoolDay(this.currentScheduleIndex))
        //might later want to add a check to make sure that currentClassPeriodIndex is not greater than the number of classes in the schedule for today
    }

    /**
     * this checks to see if the current time is between the start of the first scheduled class and the end of the last scheduled class. This indicates that school is currently in session
     *
     * @returns a boolean representing if school is in session
     */
    schoolIsInSession = ():boolean => {

        return Helpers.checkTimeRange(
            Helpers.getTimeObjectFromTime(this.currentDate),
            this.school.schedules[this.currentScheduleIndex].classes[0].startTime,
            this.school.schedules[this.currentScheduleIndex].classes[this.school.schedules[this.currentScheduleIndex].classes.length-1].endTime
            ) === 0
    }


    /**
     * This updates the variables that keep track of the current time and date
     */
    updateTime = () => { this.currentDate = new Date();}

    /**
     * @returns the current time as a formatted string
     */
    getCurrentTimeString = ():string => { return this.currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: !this.use24HourTime }) }

    /**
     * @returns the current date as a formatted string
     */
    getCurrentDateString = ():any => { 
    return ["on", <strong> {this.currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) } </strong>]
    }


    /**
     * @returns the index of the class that started most recently
     */
    getMostRecentlyStartedClassIndex = ():number => {

        if (Helpers.isNoSchoolDay(this.currentScheduleIndex)) {
            //return immediately if there is no school today
            return -1
        }

        
        //using for over forEach() because we are breaking out of the loop early
        for (let i = 0; i < this.school.schedules[this.currentScheduleIndex].classes.length; i++) {
            let classPeriodStatus = Helpers.checkClassTime(this.school.schedules[this.currentScheduleIndex].classes[i], this.currentDate)
            let nextClassPeriodStatus;
            if (i+1 < this.school.schedules[this.currentScheduleIndex].classes.length) {
                nextClassPeriodStatus = Helpers.checkClassTime(this.school.schedules[this.currentScheduleIndex].classes[i+1], this.currentDate)
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
        return -1
    }

    /**
     * This fucntion is used for calculating how long until school starts
     * @returns the time to the start of school as a string
     */
    getTimeToStartOfSchoolString = ():string => {
        if (!this.classIsInSession() && !Helpers.isNoSchoolDay(this.currentScheduleIndex) && Helpers.compareTimes(Helpers.getTimeObjectFromTime(this.currentDate), this.school.schedules[this.currentScheduleIndex].classes[0].startTime) === -1) {
            return Helpers.getTimeStringFromObject(this.getTimeTo(this.school.schedules[this.currentScheduleIndex].classes[0].startTime));
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
    getTimeTo = (timeObject:Time):Time => {
        return Helpers.getTimeDelta(Helpers.getTimeObjectFromTime(this.currentDate), timeObject)
    }


    /**
     *
     * @param {*} index the index of the class to return the name for
     * @returns returns the class name for the given index or "No Class" if there is no class in session
     */
    getClassName = (index:number):string => {
        var classes = this.school.schedules[this.currentScheduleIndex].classes;
        
        if (index >= 0 && index < classes.length) {
                return classes[index].name.toString()
        } else {
            return "No Class"
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
    // flashMessage = (message:string, type = this.FLASH_INFO, timeout = 5000) => {
    //     let flash = document.getElementById("flash")

    //     flash.innerHTML = message;
    //     // flash.style.visibility = "visible";
    //     flash.style.display = "normal";

    //     switch (type) {
    //         case this.FLASH_SUCCESS:
    //             flash.className = "success"; 
    //             break;

    //         case this.FLASH_WARN:
    //             flash.className = "warning";
    //             break;
                
    //         case this.FLASH_DANGER:
    //             flash.className = "danger";
    //             break;

    //         default: //FLASH_INFO
    //             flash.className = "info";
    //     }
    //     // maybe animate down or fade in

    //     if (timeout > 0) {
    //         setTimeout( function remove() {
    //             // flash.style.visibility = "hidden";
    //             flash.style.display = "none";
    //         }, timeout)
    //     }

    // }


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