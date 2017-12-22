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
    let day = moment('2017-04-01')
    day.startOf('week')

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

      bookings: [
        // 9, 12, 45
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

  handleBookSession = (date) => {
    const utcRangeFrom = date.utc()
    const utcRangeTo = utcRangeFrom.clone().add('30', 'minutes')

    const begin = utcRangeFrom.format('YYYY-MM-DD HH:mm')
    const end = utcRangeTo.format('YYYY-MM-DD HH:mm')
    console.log('booking utc time ', begin, end)
    this.schedulingApi.bookSession(this.state.user1Id, this.state.user2Id, begin, end)
      .then(result => console.log('book result', result))

    // const range = this.state.startDate.clone().startOf('week').utc().add(timeCode, 'hours')
    // console.log('utc range', range.format('YYYY-MM-DD HH:mm'))
    // range.local()
    // console.log('local range', range.format('YYYY-MM-DD HH:mm'))
    // const rangeFrom = moment(range)
    // const rangeTo = rangeFrom.clone().add('30', 'minutes')
    // console.log('range in current timezone')
    // console.log(rangeFrom.format('YYYY-MM-DD HH:mm'), rangeTo.format('YYYY-MM-DD HH:mm'))
    //
    // const utcRangeFrom = moment.utc(range)
    // const utcRangeTo = utcRangeFrom.clone().add('30', 'minutes')
    // console.log(utcRangeFrom.format('YYYY-MM-DD HH:mm'), utcRangeTo.format('YYYY-MM-DD HH:mm'))
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
        const flattenBookings = (bookings) => bookings.map(b => {
          const time = moment(JSON.parse(b.during)[0])
          let weekStart = time.clone().startOf('week')
          const diff = time.diff(weekStart, 'hours')
          return diff
        })
        const user1Flattened = flattenSchedule(user1Avail.schedules)
        const user2Flattened = flattenSchedule(user2Avail.schedules)
        const user1Bookings = flattenBookings(user1Avail.bookings)
        const user2Bookings = flattenBookings(user2Avail.bookings)
        const bookings = _.uniq(_.concat(user1Bookings, user2Bookings))

        // console.log('user 1 avail', user1Flattened)
        // console.log('user 2 avail', user2Flattened)
        // console.log('all bookings', bookings)
        this.setState({user1Availability: user1Flattened, user2Availability: user2Flattened, bookings})
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
        bookedTimes={this.state.bookings}
        onBookSession={this.handleBookSession}
      />
    </div>
  }
}
