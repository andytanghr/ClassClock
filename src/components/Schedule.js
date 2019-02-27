import React, { Component } from 'react';
import '../App.css';

class Schedule extends Component {

    constructor() {
        super();

        this.state={
            schoolName: '',
            scheduleDisplay: ''

        }

    }


    /**
     * this for populating the table on the schedule page
     *
     */
    
    populateScheduleTable = () => {
        // var body = document.getElementsByTagName('body')[0];
        return (
            <table id="scheduleTable" className="centeredInline topSpace">
                <tbody>
                    {this.props.classes.map( (classPeriod) => {
                        return(<tr>
                            <td>{classPeriod.name}</td>
                            <td>{this.getFormattedTimeStringFromObject(classPeriod.startTime) + " - " + this.getFormattedTimeStringFromObject(classPeriod.endTime)}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        );
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


    

    render() {
        return (
            <div className="App">
              <a className="navbutton" href="index.html"><i className="fas fa-home"></i></a>

                <br/>

                <h1 className="centered topSpace bottomSpace" id="schoolName">{this.state.schoolName}</h1>

                <p className="centered bottomSpace" id="scheduleDisplay">{this.state.scheduleDisplay}</p>

                {this.populateScheduleTable()}

            </div>
        );
    }
}

export default Schedule;