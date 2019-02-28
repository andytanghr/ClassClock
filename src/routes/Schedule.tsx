import React, { Component } from 'react';
import '../App.css';
import Helpers from '../utils/Helpers';
import { School } from '../@types/scheduledata';

interface IndexState {
    schoolName?: string
    scheduleDisplay?: string

  }

class Schedule extends Component<{school: School}, IndexState> {

    constructor(props:any) {
        super(props);

        this.state={
            schoolName: this.props.school.fullName,
            scheduleDisplay: this.props.school.schedules[Helpers.getCurrentScheduleIndex(this.props.school.schedules)].name + " schedule"

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
                    {this.props.school.schedules[Helpers.getCurrentScheduleIndex(this.props.school.schedules)].classes.map( (classPeriod) => {
                        return(<tr>
                            <td>{classPeriod.name}</td>
                            <td>{Helpers.getFormattedTimeStringFromObject(classPeriod.startTime) + " - " + Helpers.getFormattedTimeStringFromObject(classPeriod.endTime)}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        );
    }


    

    render() {
        return (
            <div className="App">
              <a className="navbutton" href="/"><i className="fas fa-home"></i></a>

                <br/>

                <h1 className="centered topSpace bottomSpace" id="schoolName">{this.state.schoolName}</h1>

                <p className="centered bottomSpace" id="scheduleDisplay">{this.state.scheduleDisplay}</p>

                {this.populateScheduleTable()}

            </div>
        );
    }
}

export default Schedule;