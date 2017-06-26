import React from 'react'
import _ from 'lodash'
import {
  codeToTime,
  pad,
  timeToCode,
  days
} from './date-utils'
import {
  Button
} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import moment from 'moment'
import styles from './App.scss'

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

import EditSchedule from './EditSchedule'
import {schedulingApi} from './schedulingApi'
import Input from 'react-toolbox/lib/input'

const dayMapFromSchedule = (schedule) => {
  let dayMap = {}
  _.each(schedule, (range) => {
    let day = Math.floor(range[0] / 24)
    dayMap[days[day]] = dayMap[days[day]] || []
    dayMap[days[day]].push(codeToTime(range[0], day) + ' - ' + codeToTime(range[1], day))
  })
  return dayMap
}

const ScheduleRow = ({cs, editSchedule, removeSchedule}) => {
  let dayMap = dayMapFromSchedule(cs.schedule)
  return <li>
    Except {cs.fromDate.format('MMMM Do YYYY')} - {cs.toDate.format('MMMM Do YYYY')}
    {Object.keys(dayMap).map(day =>
      <div key={day}>
        {day}: {dayMap[day].join(', ')}
      </div>)
    }
    <Button inverse onClick={editSchedule.bind(this, cs)}>Edit</Button>
    <Button inverse onClick={removeSchedule.bind(this, cs)}>X</Button>
  </li>
}

const mapTimeZone = (arr) => {
  let offset = new Date().getTimezoneOffset() / 60
  console.log('q', offset)
  return arr.map(time => time - offset)
}

const mapToUTC = (arr) => {
  let offset = new Date().getTimezoneOffset() / 60
  return arr.map(time => time + offset)
}

class Scheduling extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      uid: '',
      schedules: [
        {
          //default
          schedule: [
            [32, 33],
            [37, 39],
          ]
        },
        {
          fromDate: moment(),
          toDate: moment(),
          schedule: [
            [8, 12],
            [14, 16]
          ]
        }
      ]
    }

    this.schedulingApi = schedulingApi('-KnKKk9AC3Ea08CBuUlo')
  }


  componentDidMount() {
    this.schedulingApi.getAllAvailability().then(availability => {
      console.log(availability)
      this.setState({
        schedules: availability.schedules.map(s => {
          console.log('qq', s)
          let range = s.exception_range ? JSON.parse(s.exception_range).map(t => moment(t)) : undefined
          let availability = s.availability.map(a => mapTimeZone(JSON.parse(a)))
          return {
            id: s.id,
            schedule: availability,
            isBlocked: s.is_blocked,
            fromDate: range ? range[0] : undefined,
            toDate: range ? range[1] : undefined
          }
        })
      })
    })
  }

  editSchedule = (schedule) => {
    let scheduleIndex = _.indexOf(this.state.schedules, schedule)
    this.setState({
      editing: true,
      selectedScheduleIndex: scheduleIndex,
      savedSchedules: _.cloneDeep(this.state.schedules)
    })
  }

  cancelEditingSchedule = () => {
    this.setState({
      editing: false,
      schedules: this.state.savedSchedules
    })
  }

  setSchedule = () => {
    let schedule = this.state.schedules[this.state.selectedScheduleIndex]
    let utcSchedule = schedule.schedule.map(a => mapToUTC(a))
    let updateStateOrCancel = (promise) => promise.then(result => {
      console.log('new id', result.id)
      schedule.id = result.id || schedule.id
      this.setState({
        editing: false,
        savedSchedule: undefined
      })
    }).catch(err => {
      console.log('error adding new schedule')
      this.cancelEditingSchedule()
    })

    let fromDate = schedule.fromDate && schedule.fromDate.format('YYYY-MM-DD')
    let toDate = schedule.toDate && schedule.toDate.format('YYYY-MM-DD[T23:59]')
    if (schedule.id) {
      console.log("updating", schedule)
      updateStateOrCancel(this.schedulingApi.updateAvailability(schedule.id, fromDate, toDate, utcSchedule, schedule.isBlocked))
    } else {
      console.log("creating new", schedule)
      updateStateOrCancel(this.schedulingApi.addNewAvailability(fromDate, toDate, utcSchedule, schedule.isBlocked))
    }

  }

  onUpdateSelectedSchedule = (newValue) => {
    console.log('sc updated', newValue)
    Object.keys(newValue).forEach(key => this.state.schedules[this.state.selectedScheduleIndex][key] = newValue[key])
    this.setState({schedules: this.state.schedules})
  }

  addNewTime = () => {
    let savedSchedules = _.cloneDeep(this.state.schedules)
    this.state.schedules.push({fromDate: moment(), toDate: moment(), schedule: []})
    this.setState({
      editing: true,
      selectedScheduleIndex: this.state.schedules.length - 1,
      savedSchedules: savedSchedules
    })
  }

  addNewBlockedTime = () => {
    let savedSchedules = _.cloneDeep(this.state.schedules)
    this.state.schedules.push({fromDate: moment(), toDate: moment(), isBlocked: true, schedule: []})
    this.setState({
      editing: true,
      selectedScheduleIndex: this.state.schedules.length - 1,
      savedSchedules: savedSchedules
    })
  }

  removeSchedule = (schedule) => {
    let id = schedule.id
    console.log('removing', id)
    this.schedulingApi.deleteAvailability(id)
      .then(()=> {
        console.log('removed success')
        this.state.schedules = _.reject(this.state.schedules, s => s == schedule)
        this.setState({})
      })
      .catch(e => {
        console.error('error deleting', e)
      })

  }

  handleUidChange = (value) => {
    console.log('uid', value)
    this.setState({uid: value});
  }

  render() {
    let dayMap = dayMapFromSchedule(this.state.schedules[0].schedule)
    return <div>
      <div style={{background: '#ddd'}}>
        <Input type='text' label='UserId' name='uid' value={this.state.uid} onChange={this.handleUidChange}/>
      </div>
      <h1>My Availability</h1>
      <h2>Available Time</h2>
      {JSON.stringify(this.state.availability)}
      <ul>
        <li>Default Schedule</li>
        {Object.keys(dayMap).map(day =>
          <div key={day}>
            {day}: {dayMap[day].join(', ')}
          </div>)
        }
        <Button inverse onClick={this.editSchedule.bind(this, this.state.schedules[0])}>Edit</Button>

        {_.tail(this.state.schedules)
          .filter(cs => !cs.isBlocked)
          .map((cs, idx) => <ScheduleRow key={idx} cs={cs} editSchedule={this.editSchedule}
                                         removeSchedule={this.removeSchedule}/>)}
      </ul>
      <span onClick={this.addNewTime}>Add new available time</span>

      <Dialog active={this.state.editing} className={styles.editDialog}>
        <EditSchedule
          hasDateRangeSelector={this.state.selectedScheduleIndex > 0}
          schedule={this.state.schedules[this.state.selectedScheduleIndex]}
          onUpdate={this.onUpdateSelectedSchedule}
        />
        <Button primary onClick={this.setSchedule}>Set</Button>
        <Button primary onClick={this.cancelEditingSchedule}>Cancel</Button>
      </Dialog>

      <h2>Blocked Time</h2>
      <ul>
        {_.tail(this.state.schedules)
          .filter(cs => cs.isBlocked)
          .map((cs, idx) => <ScheduleRow key={idx} cs={cs} editSchedule={this.editSchedule}
                                         removeSchedule={this.removeSchedule}/>)}
      </ul>
      <span onClick={this.addNewBlockedTime}>Add new blocked time</span>
    </div>
  }
}

export default Scheduling
