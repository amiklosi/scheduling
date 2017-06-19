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

class Scheduling extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
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
  }

  editSchedule = (scheduleIndex) => {
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
    this.setState({
      editing: false,
      savedSchedule: undefined
    })
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

  removeSchedule = (schedule) => {
    this.state.schedules = _.reject(this.state.schedules, s => s == schedule)
    this.setState({})
  }

  dayMapFromSchedule = (schedule) => {
    let dayMap = {}
    _.each(schedule, (range) => {
      let day = Math.floor(range[0] / 24)
      dayMap[days[day]] = dayMap[days[day]] || []
      dayMap[days[day]].push(codeToTime(range[0], day) + ' - ' + codeToTime(range[1], day))
    })
    return dayMap
  }

  render() {
    let dayMap = this.dayMapFromSchedule(this.state.schedules[0].schedule)
    return <div>
      <h1>My Availability</h1>
      <h2>Available Time</h2>
      <ul>
        <li>Default Schedule</li>
        {Object.keys(dayMap).map(day =>
          <div key={day}>
            {day}: {dayMap[day].join(', ')}
          </div>)
        }
        <Button inverse onClick={this.editSchedule.bind(this, 0)}>Edit</Button>

        {_.tail(this.state.schedules).map((cs, idx) => {
          let dayMap = this.dayMapFromSchedule(cs.schedule)
          return <li key={idx}>
            Except {cs.fromDate.format('MMMM Do YYYY')} - {cs.toDate.format('MMMM Do YYYY')}
            {Object.keys(dayMap).map(day =>
              <div key={day}>
                {day}: {dayMap[day].join(', ')}
              </div>)
            }
            <Button inverse onClick={this.editSchedule.bind(this, idx + 1)}>Edit</Button>
            <Button inverse onClick={this.removeSchedule.bind(this, cs)}>X</Button>
          </li>
        })
        }
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
    </div>
  }
}

export default Scheduling
