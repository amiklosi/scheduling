import React from 'react'
import _ from 'lodash'
import EditScheduleGrid from './EditScheduleGrid'
import {codeToTime, pad, timeToCode, days} from './date-utils'
import AddNewTime from "./AddNewTime";
import {Button} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import moment from 'moment'

import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';


var options = []


class Scheduling extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      addingNewTime: false,
      editingDefault: false,
      defaultSchedule: [[32, 33], [56, 60], [62, 64], [34, 36], [40, 48]],
      customSchedules: [
        {
          fromDate: moment(),
          toDate: moment(),
          schedule: [[8, 12], [14, 16]]
        }
      ]
    }
    let idx = 0
    for (let min = 0; min < 60; min += 30) {
      options.push({value: idx++, label: pad(12) + ':' + pad(min) + ' AM'})
    }

    for (let i = 1; i < 12; i++) {
      for (let min = 0; min < 60; min += 30) {
        options.push({value: idx++, label: pad(i) + ':' + pad(min) + ' AM'})
      }
    }
    for (let min = 0; min < 60; min += 30) {
      options.push({value: idx++, label: pad(12) + ':' + pad(min) + ' PM'})
    }

    for (let i = 1; i < 12; i++) {
      for (let min = 0; min < 60; min += 30) {
        options.push({value: idx++, label: pad(i) + ':' + pad(min) + ' PM'})
      }
    }
  }

  editDefaultSchedule = () => {
    this.setState({editingDefault: true, savedSchedule: _.cloneDeep(this.state.defaultSchedule)})
  }

  cancelEditingDefaultSchedule = () => {
    this.setState({editingDefault: false, defaultSchedule: this.state.savedSchedule})
  }

  setDefaultSchedule = () => {
    this.setState({editingDefault: false, savedSchedule: undefined})
  }

  onUpdateSchedule = (newValue) => {
    console.log('sc updated', newValue)
    this.setState({defaultSchedule: newValue})

  }

  addNewTime = () => {
    this.setState({addingNewTime: true})
  }

  handleAddNewAvailableTime = (fromDate, toDate, ranges) => {
    toDate = toDate || fromDate
    console.log('adding new avail', fromDate.format(), toDate.format(), ranges)
    this.state.customSchedules.push(
      {
        fromDate,
        toDate,
        schedule: ranges
      }
    )
    this.setState({addingNewTime: false})
  }

  removeCustomSchedule = (customSchedule) => {
    this.state.customSchedules = _.reject(this.state.customSchedules, s => s == customSchedule)
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

  state = {}

  handleFromChange = (val) => {
    console.log('qq',val)
    let newToTime = (this.state.toTime && this.state.toTime.value < val.value) ? val : this.state.toTime
    this.setState({fromTime: val, toTime: newToTime})
  }
  handleToChange = (val) => {
    this.setState({toTime: val})
  }

  render() {
    let dayMap = this.dayMapFromSchedule(this.state.defaultSchedule)
    let filteredOptions = _.filter(options, o => o.value > (this.state.fromTime || {}).value)
    return <div>
      <h1>My Availability</h1>
      <h2>Available Time</h2>
      <div style={{width: 80}}>
        <Select
          className="mySelect"
          name="form-field-name"
          value={this.state.fromTime}
          options={options}
          onChange={this.handleFromChange}
          matchProp='label'
          clearable={false}
        />

        to

        <Select
          name="form-field-name"
          value={this.state.toTime}
          options={filteredOptions}
          onChange={this.handleToChange}
          matchProp='label'
          clearable={false}
        />


      </div>

      <ul>
        <li>Default Schedule</li>
        {Object.keys(dayMap).map(day =>
          <div key={day}>
            {day}: {dayMap[day].join(', ')}
          </div>)
        } <a onClick={this.editDefaultSchedule}>Edit</a>

        {this.state.customSchedules.map(cs => {
          let dayMap = this.dayMapFromSchedule(cs.schedule)
          return <li>
            Except {cs.fromDate.format('MMMM Do YYYY')} - {cs.toDate.format('MMMM Do YYYY')}
            {Object.keys(dayMap).map(day =>
              <div key={day}>
                {day}: {dayMap[day].join(', ')}
              </div>)
            }
            <Button inverse onClick={this.removeCustomSchedule.bind(this, cs)}>X</Button>
          </li>
        })
        }
      </ul>
      <span onClick={this.addNewTime}>Add new available time</span>

      <Dialog active={this.state.addingNewTime}>
        <AddNewTime onCancel={() => this.setState({addingNewTime: false})} onAddNew={this.handleAddNewAvailableTime}/>
      </Dialog>

      <Dialog active={this.state.editingDefault} type='large'>
        <EditScheduleGrid schedule={this.state.defaultSchedule} onUpdate={this.onUpdateSchedule}/>
        <Button primary onClick={this.setDefaultSchedule}>Set</Button>
        <Button primary onClick={this.cancelEditingDefaultSchedule}>Cancel</Button>
      </Dialog>

      <h2>Blocked Time</h2>
    </div>
  }
}


export default Scheduling
