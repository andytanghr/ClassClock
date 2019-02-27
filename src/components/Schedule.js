import React, { Component } from 'react';
import '../App.css';
import Helpers from './Helpers';

class Schedule extends Component {

    constructor(props) {
        super(props);

        this.state={
            schoolName: this.props.schools[0].fullName,
            scheduleDisplay: this.props.schools[0].schedules[Helpers.getCurrentScheduleIndex(this.props.schools[0].schedules)].name + " schedule"

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
                    {this.props.schools[0].schedules[Helpers.getCurrentScheduleIndex(this.props.schools[0].schedules)].classes.map( (classPeriod) => {
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