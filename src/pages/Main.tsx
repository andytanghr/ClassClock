import React, { Component } from 'react'
import moment, { Moment } from 'moment'
import {
  Container,
  Time as TimeLabel,
  NavButton,
  Title,
  Content
} from './Main.styles'
import { School, Schedule, Period } from '../@types/scheduleData'

interface Props {
  school: School
  time: Moment
  schedule?: Schedule
  nextClass?: Period
  currentClass?: Period
  use24Hr: boolean
}

class Main extends Component<Props> {
  render () {
    let nextClassTime =
      this.props.currentClass && moment(this.props.currentClass.endTime)
    let timeLeft =
      nextClassTime && moment.duration(nextClassTime.diff(this.props.time))

    return (
      <Container>
        <div>
          <Title>It is currently: </Title>
          <TimeLabel style={{ margin: 0 }}>
            {this.props.time.format('h:mm:ss A')}
          </TimeLabel>
          <Title>
            on{' '}
            <span style={{ fontWeight: 'bold' }}>
              {this.props.time.format('ddd, MMM Mo, YYYY')}
            </span>
          </Title>

          <br />

          <Title>
            You are viewing the{' '}
            <span style={{ fontWeight: 'bold' }}>
              {this.props.schedule && this.props.schedule.name}
            </span>{' '}
            schedule
          </Title>
          <Title>
            from{' '}
            <span style={{ fontWeight: 'bold' }}>
              {this.props.school.fullName}
            </span>
          </Title>
          <NavButton href='schedule'>View Schedule</NavButton>

          <br />
          <br />

          <Title>You are currently in: </Title>
          <Content>
            {this.props.currentClass
              ? this.props.currentClass.name
              : 'No Class'}
          </Content>

          <Title>...which ends in: </Title>
          <TimeLabel style={{ fontSize: '3em' }}>
            {timeLeft && `${timeLeft.format('hh:mm:ss', { trim: false })}`}
          </TimeLabel>

          <Title>Your next class period is: </Title>
          <Content>
            {this.props.nextClass ? this.props.nextClass.name : 'No Class'}
          </Content>
        </div>
      </Container>
    )
  }
}

export default Main
