import React from "react"
import { Moment } from "moment-timezone"

import "../styles/layout.css"
import { Centered } from "../styles";

interface TimeProps {
    currentTime: Moment
    use24HourTime: boolean
}

export const TimeHeader = (props: TimeProps) => {
    let timeString = props.use24HourTime ? props.currentTime.format("H:mm:ss") : props.currentTime.format("h:mm:ss a")
    let dateString = props.currentTime.format("ddd, MMM Do, YYYY")

    return (
        <div>
            <p style={Centered}>It is currently: </p>
            <h1 style={Centered} id="time">{timeString}</h1>
            <p style={Centered} id="date">on <strong>{dateString}</strong></p>
        </div>
    )
}