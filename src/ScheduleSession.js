import React from 'react'
import ScheduleSessionTable from "./ScheduleSessionTable"

export default class ScheduleSession extends React.Component {
  constructor() {
    super()
    this.state = {
      user1Availability: [
        [5, 6],
        [15, 20],
        [23, 24],
      ],

      user2Availability: [
        [27, 28],
        [15, 16],
      ],

      bookedTimes: [
        9, 12, 45
      ]
    }

  }

  render() {
    return <div>
      Schedule Session
      <ScheduleSessionTable
        user1Availability={this.state.user1Availability}
        user2Availability={this.state.user2Availability}
        bookedTimes={this.state.bookedTimes}
      />
    </div>
  }
}
