import React from 'react'
import _ from 'lodash'
import styles from './ScheduleSessionTable.scss'
import {codeToTime, isAvailable, isBookedTime, mondayBasedDays} from './date-utils'

export default class ScheduleSessionTable extends React.Component {
  getCellClass = (dayIdx, hourIdx) => {
    const cellCode = dayIdx * 24 + hourIdx
    const isUser1Available = isAvailable(cellCode, this.props.user1Availability)
    const isUser2Available = isAvailable(cellCode, this.props.user2Availability)
    if (isBookedTime(cellCode, this.props.bookedTimes)) {
      return styles.booked
    }
    if (isUser1Available && isUser2Available) {
      return styles.bookable
    }
    if (isUser1Available) {
      return styles.user1Available
    }
    if (isUser2Available) {
      return styles.user2Available
    }
  }

  render() {
    const table = <table className={styles.table}>
      <thead>
      <tr>
        <th className={styles.cell}></th>
        {mondayBasedDays.map(day => <th key={day} className={styles.cell}>{day}</th>)}
      </tr>
      </thead>
      <tbody>
      {_.range(48).map(idx =>
        <tr key={idx}>
          <td>{idx % 2 == 0 && codeToTime(idx / 2, 0)}</td>
          {_.range(7).map(dayIdx => <td className={this.getCellClass(dayIdx, idx / 2)} key={dayIdx}>&nbsp;</td>)}
        </tr>)
      }
      </tbody>
    </table>

    return table
  }
}
