import React from 'react'
import _ from 'lodash'
import {
  codeToTime,
  pad,
  timeToCode,
  days
} from './date-utils'
import Dialog from 'react-toolbox/lib/dialog'
import moment from 'moment'
import styles from './App.scss'

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

import EditSchedule from './EditSchedule'
import {schedulingApi} from './schedulingApi'
import Input from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'


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
      // uid: '-EbuNpiIu4Y-iEiGzazU',
      // uid: '-KnYNpiIu4Y-iEiGzazU',
      // // remote
      uid: '-KlkMya8T6Fr4a7_ZDvp',
      // host: 'http://localhost:5002/smashcut-a23d2/us-central1/schedule',
      host: 'https://us-central1-smashcut-a23d2.cloudfunctions.net/schedule',
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

    this.schedulingApi = schedulingApi(this.state.host, this.state.uid)
  }

  loadAvailability = () => {
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

  componentDidMount() {
    this.loadAvailability()
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

  addDefaultSchedule = () => {
    this.state.schedules.push({schedule: []})
    this.setState({
      editing: true,
      selectedScheduleIndex: 0,
      savedSchedules: []
    })

  }

  removeSchedule = (schedule) => {
    let id = schedule.id
    console.log('removing', id)
    this.schedulingApi.deleteAvailability(id)
      .then(() => {
        console.log('removed success')
        this.state.schedules = _.reject(this.state.schedules, s => s == schedule)
        this.setState({})
      })
      .catch(e => {
        console.error('error deleting', e)
      })

  }

  handleUidChange = (value) => {
    this.setState({uid: value})
  }

  handleHostChange = (value) => {
    this.setState({host: value})
  }


  reloadSchedule = () => {
    this.schedulingApi = schedulingApi(this.state.host, this.state.uid)
    this.loadAvailability()
  }

  render() {
    let hasDefault = this.state.schedules.length > 0
    let dayMap = hasDefault && dayMapFromSchedule(this.state.schedules[0].schedule)
    return <div>
      <div style={{width: 500}}>
        <div style={{background: '#eee'}}>
          <Input type='text' label='Host' name='host' value={this.state.host} onChange={this.handleHostChange}/>
        </div>
        <div style={{background: '#eee'}}>
          <Input type='text' label='UserId' name='uid' value={this.state.uid} onChange={this.handleUidChange}/>
        </div>
        <Button icon='bookmark' label='Refresh' accent onClick={this.reloadSchedule} />
      </div>
      <h1>My Availability</h1>
      <h2>Available Time</h2>
      {JSON.stringify(this.state.availability)}
      <ul>
        <li>Default Schedule</li>
        {hasDefault && <div>
          {Object.keys(dayMap).map(day =>
            <div key={day}>
              {day}: {dayMap[day].join(', ')}
            </div>)
          }
          <Button inverse onClick={this.editSchedule.bind(this, this.state.schedules[0])}>Edit</Button>
        </div>}

        {_.tail(this.state.schedules)
          .filter(cs => !cs.isBlocked)
          .map((cs, idx) => <ScheduleRow key={idx} cs={cs} editSchedule={this.editSchedule}
                                         removeSchedule={this.removeSchedule}/>)}
      </ul>
      {hasDefault && <span onClick={this.addNewTime}>Add new available time</span>}
      {!hasDefault && <span onClick={this.addDefaultSchedule}>Set up default schedule</span>}

      <Dialog active={this.state.editing} className={styles.editDialog}>
        <EditSchedule
          hasDateRangeSelector={this.state.selectedScheduleIndex > 0}
          schedule={this.state.schedules[this.state.selectedScheduleIndex]}
          onUpdate={this.onUpdateSelectedSchedule}
        />
        <Button primary onClick={this.setSchedule}>Set</Button>
        <Button primary onClick={this.cancelEditingSchedule}>Cancel</Button>
      </Dialog>

      {hasDefault && <div><h2>Blocked Time</h2>
        <ul>
          {_.tail(this.state.schedules)
            .filter(cs => cs.isBlocked)
            .map((cs, idx) => <ScheduleRow key={idx} cs={cs} editSchedule={this.editSchedule}
                                           removeSchedule={this.removeSchedule}/>)}
        </ul>
        <span onClick={this.addNewBlockedTime}>Add new blocked time</span>
      </div>}
    </div>
  }
}

export default Scheduling
