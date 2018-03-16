import React from 'react'
import _ from 'lodash'
import styles from './ScheduleSession.scss'
import {codeToTime, isAvailable, isBookedTime, mondayBasedDays} from './date-utils'
import moment from 'moment'


export default class ScheduleSessionTable extends React.Component {
  handleMouseOver = (timeCode) => {
    this.setState({selectedTimeCode: timeCode})
  }

  handleMouseOut = () => {
    this.setState({selectedTimeCode: undefined})
  }

  handleClick = (date) => {
    this.props.onBookSession(date)
  }

  getCellClass = (dayIdx, hourIdx) => {
    const cellCode = dayIdx * 24 + hourIdx
    const isUser1Available = isAvailable(cellCode, this.props.user1Availability)
    const isUser2Available = isAvailable(cellCode, this.props.user2Availability)
    const selectedTimeCode = _.get(this.state, 'selectedTimeCode')
    const isSelected = cellCode == selectedTimeCode// || cellCode == selectedTimeCode + 0.5
    const style = (() => {
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
      return styles.none
    })()
    return style + ' ' + (isSelected ? styles.selected : '')
  }

  render() {
    const startDate = moment(this.props.startDate)// || moment()
    const table = <table className={styles.table}>
      <thead>
      <tr>
        <th className={styles.cell}></th>
        {_.range(7).map(day => <th key={day} className={styles.cell}>
          <div className={styles.dayName}>{startDate.clone().add(day, 'days').format('dddd')}</div>
          <div className={styles.day}>{startDate.clone().add(day, 'days').format('D')}</div>

        </th>)}
      </tr>
      </thead>
      <tbody>
      {_.range(48).map(idx =>
        <tr key={idx}>
          <td className={styles.timeCell} width="80px">{codeToTime(idx / 2, 0)}</td>
          {_.range(7).map(dayIdx => {
            const timeCode = dayIdx % 7 * 24 + idx / 2
              return <td className={this.getCellClass(dayIdx, idx / 2)} key={dayIdx}
                         onMouseOver={this.handleMouseOver.bind(this, timeCode)}
                         onMouseOut={this.handleMouseOut}
              onClick={this.handleClick.bind(this, this.props.startDate.clone().add(dayIdx, 'days').add(idx / 2, 'hours'))}>
                <div className={styles.debugInfo}>{timeCode}</div>
                &nbsp;
              </td>
            }
          )
          }
        </tr>)
      }
      </tbody>
    </table>

    return table
  }
}
