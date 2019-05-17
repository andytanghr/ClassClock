import React, { Component } from 'react'
import moment, { Moment } from 'moment'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MainPage from './pages/Main'
import SettingsPage from './pages/Settings'
import SchedulePage from './pages/Schedule'

import { getSchedule, getUpcomingClasses } from './utils/Helpers'
import { lohs } from './data/schools'
import { School, Period, Schedule } from './@types/scheduleData'

import './App.css'

interface State {
  school: School
  time: Moment
  schedule?: Schedule
  nextClass?: Period
  currentClass?: Period
}

class App extends Component<{}, State> {
  state = {
    school: lohs,
    time: moment(),
    schedule: undefined,
    currentClass: undefined,
    nextClass: undefined
  }

  updateTimer = 0

  componentDidMount () {
    this.update()
    // this.updateTimer = window.setInterval(this.update, 1000)
  }

  update = () => {
    let time = moment()
    let schedule

    schedule = getSchedule(this.state.school.schedules, time.isoWeekday())
    if (schedule === undefined) {
      this.setState({
        time: moment()
      })

      return
    }

    let classes = getUpcomingClasses(schedule, time)
    let currentClass = classes && classes.currentClass
    let nextClass = classes && classes.nextClass

    this.setState({
      time: moment(),
      currentClass,
      nextClass,
      schedule
    })
  }

  render () {
    return (
      <Router>
        <div>
          <Route
            exact
            path='/'
            component={() => {
              return (
                <MainPage
                  school={this.state.school}
                  time={this.state.time}
                  currentClass={this.state.currentClass}
                  nextClass={this.state.nextClass}
                  schedule={this.state.schedule}
                  use24Hr={false}
                />
              )
            }}
          />
          <Route
            path='/schedule'
            component={() => {
              return (
                <SchedulePage
                  school={this.state.school}
                  schedule={this.state.schedule}
                  use24Hr={false}
                />
              )
            }}
          />
          <Route
            path='/settings'
            component={() => {
              return <SettingsPage />
            }}
          />
        </div>
      </Router>
    )
  }
}

export default App
