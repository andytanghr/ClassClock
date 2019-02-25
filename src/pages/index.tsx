import React from "react"

import "../styles/layout.css"
import SEO from "../components/seo"
import { TimeHeader } from "../components/timeHeader";

import { School, Schedule, Period, Time } from "../@types/school";
import { PeriodSummary } from "../components/periodSummary";
import * as moment from "moment-timezone";
import { Centered } from "../styles";

interface IndexState {
  mounted: boolean
  currentTime: moment.Moment
  currentSchedule?: Schedule
  currentPeriod?: Period
  timeTillPeriodEnd?: moment.Duration
  nextSchedule?: Schedule
  nextPeriod?: Period
  school?: School
}

export default class IndexPage extends React.Component<{}, IndexState> {
  constructor (props) {
    super(props)
    
    this.state = {
      school: this.getSchoolForID('lohs'),
      currentTime: moment(),
      mounted: false
    }

    this.update()
  }

  componentDidMount () {
    this.setState({
      mounted: true
    })
  }

  getSchoolForID = (id: string): School => {
    const schedule = require('../data/schools.json')
    return schedule[id]
  }

  update = () => {
    if (this.state.mounted) {
      let upcomingSchedules = this.getUpcomingSchedules()
      let upcomingPeriods = this.getUpcomingPeriods()

      this.setState({
        currentTime: ((this.state.school) ? moment().tz(this.state.school.timeZone) : moment()),
        currentSchedule: upcomingSchedules[0],
        currentPeriod: upcomingPeriods[0],
        nextSchedule: upcomingSchedules[1],
        nextPeriod: upcomingPeriods[1],
        timeTillPeriodEnd: this.getTimeTillEnd()
      })
    }

    setTimeout(this.update, 1000)
  }

  getScheduleForDay = (day: number): [Schedule?] => {
    for (let i = 0; i < this.state.school.schedules.length; i++) {
      if (this.state.school.schedules[i].days.includes(day)) {
        return [this.state.school.schedules[i]]
      }
    }

    return [null]
  }

  getUpcomingSchedules = (): [Schedule?, Schedule?] => {
    if (!this.state.school) { return [null, null] }
    
    let today = this.state.currentTime.day()
    return [this.getScheduleForDay(today)[0], this.getScheduleForDay(today + 1 % 6)[0]]
  }

  getUpcomingPeriods = (): [Period?, Period?] => {
    if (!this.state.currentSchedule) { return [null, null] }
  
    for (let i = this.state.currentSchedule.classes.length - 1; i >= 0 ; i--) {
      let checkClass = this.state.currentSchedule.classes[i]

      if (typeof checkClass === 'undefined') { continue } // Thanks async for being wierd.

      let start = this.convertTimeObjectToMoment(checkClass.startTime)
      let end = this.convertTimeObjectToMoment(checkClass.endTime)

        if (i + 1 < this.state.currentSchedule.classes.length) { return [this.state.currentSchedule.classes[i], this.state.currentSchedule.classes[i + 1]] }
        else { return [this.state.currentSchedule.classes[i], null] }
      }
    }

    if (this.state.nextSchedule) { return [null, this.state.nextSchedule.classes[0]] }
    else { return [null, null] }
  }

  getTimeTillEnd = () => {
    if (!this.state.currentPeriod) { return null }

    let endTime = this.convertTimeObjectToMoment(this.state.currentPeriod.endTime)
    return moment.duration(endTime.diff(this.state.currentTime))
  }

convertTimeObjectToMoment = (timeObject: Time) => {
  return moment().hour(timeObject.hours).minute(timeObject.minutes)
}
  render () {
    return (
      <div>
        <SEO title="Home" keywords={[`school schedule`, `classclock`, 'lohs schedule']} />
        
        <a className="navbutton" href="settings.html"><i className="fas fa-cog"></i></a>

        <br />
        <TimeHeader use24HourTime={false} currentTime={this.state.currentTime} />
        <br />

        { this.state.currentSchedule
          ? (
            <div>
              <p style={Centered} id="schedule">You are viewing the <strong>{this.state.currentSchedule.name}</strong></p>
              <p style={Centered} id="selectedSchoolDisplay">of <strong>{this.state.school.fullName}</strong></p>
              <a style={Centered} href="schedule.html" id="viewScheduleLink">View Schedule</a>
              <br />

              <PeriodSummary currentPeriod={this.state.currentPeriod} nextPeriod={this.state.nextPeriod} timeTillEnd={this.state.timeTillPeriodEnd} />
              <br />
            </div>
          )
          : null }

        {/* <a class="navbutton" href="settings.html"><i class="fas fa-cog"></i></a> */}
      </div>
    )
  }
}
