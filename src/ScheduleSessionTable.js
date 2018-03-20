import React from 'react'
import _ from 'lodash'
import styles from './ScheduleSession.scss'
import {codeToTime, isAvailable, isBookedTime, mondayBasedDays} from './date-utils'
import moment from 'moment'
import SmashcutCalendar from "./SmashcutCalendar"


export default class ScheduleSessionTable extends React.Component {

  cellRenderer = (timeCode) => {
    return <div>. {timeCode}</div>
  }

  cellClick = (timeCode) => {
    console.log('click', timeCode)
  }

  render() {
    return <div className={styles.container}>
      <SmashcutCalendar
        startDate={this.props.startDate}
        cellRenderer={this.cellRenderer}
        cellClick={this.cellClick}
      />
    </div>

  }
}
