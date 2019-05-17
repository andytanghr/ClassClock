import React, { Component } from 'react'
import { School, Schedule } from '../@types/scheduleData'
import moment from 'moment'

import { Container } from './Styles'
import { TableRow } from './Schedule.styles'

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
          <TableRow style={{ fontWeight: 'bold' }}>{classPeriod.name}</TableRow>
          <TableRow>{`
            ${start.format(formatString)} - ${end.format(formatString)}
          `}</TableRow>
        </tr>
      )
    })
  }

  render () {
    return (
      <Container>
        <div>
          <h1>{this.props.school.fullName}</h1>
          <h3>
            {this.props.schedule && this.props.schedule.name + ' schedule'}
          </h3>

          <table style={{ margin: '1em auto' }}>
            <tbody>{this.renderSchedule()}</tbody>
          </table>
        </div>
      </Container>
    )
  }
}
