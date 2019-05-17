import React, { Component } from 'react'
import { School, Schedule } from '../@types/scheduleData'
import moment from 'moment'

interface Props {
  school: School
  schedule?: Schedule
  use24Hr: boolean
  secondsRemaining?: number
}

export default class SchedulePage extends Component<Props> {
  renderSchedule = () => {
    if (!this.props.schedule) return

    return this.props.schedule.classes.map(classPeriod => {
      let start = moment(classPeriod.startTime)
        .second(
          classPeriod.startTime.seconds ? classPeriod.startTime.seconds : 0
        )
        .millisecond(0)

      let end = moment(classPeriod.endTime)
        .second(classPeriod.endTime.seconds ? classPeriod.endTime.seconds : 0)
        .millisecond(0)

      let formatString = this.props.use24Hr ? 'kk:mm' : 'hh:mm A'

      return (
        <tr>
          <td>{classPeriod.name}</td>
          <td>{`${start.format(formatString)} - ${end.format(
            formatString
          )}`}</td>
        </tr>
      )
    })
  }

  render () {
    return (
      <div className='App'>
        <a className='navbutton' href='/'>
          <i className='fas fa-home' />
        </a>

        <br />

        <h1 className='centered topSpace bottomSpace' id='schoolName'>
          {this.props.school.fullName}
        </h1>

        <table id='scheduleTable' className='centeredInline topSpace'>
          <tbody>{this.renderSchedule()}</tbody>
        </table>
      </div>
    )
  }
}
