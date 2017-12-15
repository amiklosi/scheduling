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
      user1Id: 'KwvFfQf1hIYmp1uBzUaQz06A1ty2',  // student bender
      user2Id: 'H16kZaIbqnhXBV9L4tYV8etVfzn1',  // mentor smith
      user1Availability: [
        // [5, 6],
        // [15, 20],
        // [23, 24],
      ],

      user2Availability: [
        // [27, 28],
        // [15, 16],
      ],

      bookedTimes: [
        9, 12, 45
      ],
      startDate: day
    }

    console.log(day.isoWeekday())
    console.log(day.format('MM/D'))

    this.schedulingApi = schedulingApi('http://localhost:5000/smashcut-a23d2/us-central1/schedule', '-L-HGcJFLTvUn7sMRMv8')
  }

  componentWillMount() {
    this.selectStartDate(this.state.startDate)
  }

  updateAvailabilities = (startDate) => {
    const begin = startDate
    const end = begin.clone().add(1, 'week')
    Promise.all(
      [
        this.schedulingApi.getAvailability({userId: this.state.user1Id, begin, end}),
        this.schedulingApi.getAvailability({userId: this.state.user2Id, begin, end})
      ])
      .then(([user1Avail, user2Avail]) => {
        const flattenSchedule = (schedule) => _(schedule).map('availability').map(avs => avs.map(v => JSON.parse(v))).flatten().value()

        const user1Flattened = flattenSchedule(user1Avail.schedules)
        const user2Flattened = flattenSchedule(user2Avail.schedules)
        console.log('all avail', user1Flattened)

        this.setState({user1Availability: user1Flattened, user2Availability: user2Flattened})

      })

  }

  selectStartDate = (startDate) => {
    this.setState({startDate})
    this.updateAvailabilities(startDate)
  }

  nextWeek = () => {
    let newStartDate = this.state.startDate.clone().add(1, 'weeks')
    this.selectStartDate(newStartDate)
  }

  prevWeek = () => {
    let newStartDate = this.state.startDate.clone().subtract(1, 'weeks')
    this.selectStartDate(newStartDate)
  }

  render() {
    return <div>
      Schedule Session
      <UserSelector/>
      <WeekSelector goPrev={this.prevWeek} goNext={this.nextWeek}/>
      <ScheduleSessionTable
        startDate={this.state.startDate}
        user1Availability={this.state.user1Availability}
        user2Availability={this.state.user2Availability}
        bookedTimes={this.state.bookedTimes}
      />
    </div>
  }
}
