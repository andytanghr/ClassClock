import React from 'react'

import { Duration } from 'moment'
import { Period } from '../@types/school';

import "../styles/layout.css"
import { Centered, Time, Bigger } from '../styles';

interface PeriodProps {
    currentPeriod?: Period
    timeTillEnd?: Duration
    nextPeriod: Period
}

export const PeriodSummary = (props: PeriodProps) => {
    return (
        <div>
            <p style={Centered}>You are currently in: </p>
            <h1 style={Centered} id="currentClass">{props.currentPeriod ? props.currentPeriod.name : 'No Class'}</h1>
            <br />

            <p style={Centered} id="countdownLabel">...which ends in: </p>
            <h1 style={{...Centered, ...Time, ...Bigger}} id="timeToEndOfClass">{props.currentPeriod ? props.timeTillEnd.humanize() : 'No Class'}</h1>
            <br />

            <p style={Centered}>Your next class period is: </p>
            <h1 style={Centered} id="nextClass">{props.nextPeriod ? props.nextPeriod.name : 'No Class'}</h1>
        </div>
    )
}