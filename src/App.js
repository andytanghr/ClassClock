import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Main from './components/Main';
import Settings from './components/Settings';

class App extends Component {

    // constructor() {
    //     super();


    // }

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
      mainApp = ( props ) => {
        return (
          <Main 
            schools={this.schools}
            {...props}
          />
        );
      }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" render={this.mainApp} />
                    {/* {/* <Route path="/about" component={About} /> */}
                    <Route path="/settings" component={Settings} />
                </div>
            </Router>
        );
    }
}

export default App;
        