import React from 'react'
import _ from 'lodash'
import EditScheduleGrid from './EditScheduleGrid'
import {codeToTime, pad, timeToCode, days} from './date-utils'
import AddNewTime from "./AddNewTime";
import {Button} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import moment from 'moment'
import styles from './App.scss'

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';
import EditSchedule from './EditSchedule'

class Scheduling extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      addingNewTime: false,
      editingDefault: false,
      newSchedule: [],
      defaultSchedule: [
        [32, 33],
        [37, 39],
        // [56, 60],
        // [62, 64],
        // [34, 36],
        // [40, 48]
      ],
      customSchedules: [
        {
          fromDate: moment(),
          toDate: moment(),
          schedule: [[8, 12], [14, 16]]
        }
      ]
    }
  }

  editDefaultSchedule = () => {
    this.setState({
      editing: true, 
      editingDefault: true,
      selectedSchedule: this.state.defaultSchedule,
      savedSchedule: _.cloneDeep(this.state.defaultSchedule)
    })
  }

  cancelEditingSchedule = () => {
    if (this.state.editingDefault) {
      this.setState({editing: false, defaultSchedule: this.state.savedSchedule, editingDefault: false})
    }
  }

  setSchedule = () => {
    this.setState({editing: false, editingDefault: false, savedSchedule: undefined})
  }

  onUpdateSelectedSchedule = (newValue) => {
    
    console.log('sc updated', newValue)
    
    if (this.state.editingDefault) {
      this.setState({defaultSchedule: newValue})
    }    
  }

  cancelAddingNewSchedule = () => {
    this.setState({addingNewTime: false, newSchedule: []})
  }

  addNewSchedule = () => {
    /// ... add
    this.setState({addingNewTime: false, newSchedule: []})
  }

  onUpdateNewSchedule = (newValue) => {
    console.log('new sc updated', newValue)
    this.setState({newSchedule: newValue})

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

  render() {
    let dayMap = this.dayMapFromSchedule(this.state.defaultSchedule)
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
        <a onClick={this.editDefaultSchedule}>Edit</a>

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

      <Dialog active={this.state.addingNewTime} className={styles.editDialog}> 
        <AddNewTime onCancel={() => this.setState({addingNewTime: false})} onAddNew={this.handleAddNewAvailableTime}/>
      </Dialog>

      <Dialog active={this.state.editing} className={styles.editDialog}>
        <EditSchedule schedule={this.state.selectedSchedule} onUpdate={this.onUpdateSelectedSchedule}/>
        <Button primary onClick={this.setSchedule}>Set</Button>
        <Button primary onClick={this.cancelEditingSchedule}>Cancel</Button>
      </Dialog>

      <h2>Blocked Time</h2>
    </div>
  }
}


export default Scheduling
