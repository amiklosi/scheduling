import React from 'react'
import ScheduleSessionTable from "./ScheduleSessionTable"
import moment from 'moment'
import styles from './ScheduleSession.scss'

const WeekSelector = ({goPrev, goNext}) => <div className={styles.weekSelector}>
  <div onClick={goPrev} className={styles.prevCell}>&lt; Prev</div>
  <div>b</div>
  <div>c</div>
  <div>d</div>
  <div>e</div>
  <div>f</div>
  <div>g</div>
  <div onClick={goNext} className={styles.nextCell}>Next &gt;</div>
</div>

export default class ScheduleSession extends React.Component {
  constructor() {
    super()
    let day = moment()
    day.startOf('isoWeek')

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
      ],
      startDate: day,
      weekDelta: 0
    }

    console.log(day.isoWeekday());
    console.log(day.format('MM/D'));
  }

  nextWeek = () => {
    this.setState({weekDelta: this.state.weekDelta + 1})
  }

  prevWeek = () => {
    this.setState({weekDelta: this.state.weekDelta - 1})
  }

  render() {
    return <div>
      Schedule Session
      <WeekSelector goPrev={this.prevWeek} goNext={this.nextWeek}/>
      <ScheduleSessionTable
        startDate={this.state.startDate.clone().add(this.state.weekDelta, 'weeks')}
        user1Availability={this.state.user1Availability}
        user2Availability={this.state.user2Availability}
        bookedTimes={this.state.bookedTimes}
      />
    </div>
  }
}
