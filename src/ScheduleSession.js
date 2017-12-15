import React from 'react'
import ScheduleSessionTable from "./ScheduleSessionTable"
import moment from 'moment'
import styles from './ScheduleSession.scss'
import {schedulingApi} from "./schedulingApi"

const UserSelector = ({selectFirstUser, selectSecondUser}) => <div className={styles.userSelector}>
 Select User
</div>

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

    this.schedulingApi = schedulingApi('http://localhost:5000/smashcut-a23d2/us-central1/schedule', '-L-HGcJFLTvUn7sMRMv8')
  }

  componentWillMount() {
    const begin = moment("20170501", "YYYYMMDD")//this.state.startDate
    const end = begin.clone().add(1, 'week')
    this.schedulingApi.getAvailability(begin, end).then(avail =>
      console.log('all avail', avail)
    )
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
      <UserSelector/>
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
