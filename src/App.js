import React from 'react'
import _ from 'lodash'
import EditScheduleGrid from './EditScheduleGrid'
import {codeToTime, days} from './date-utils'
import AddNewTime from "./AddNewTime";

class Scheduling extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      editingDefault: false,
      defaultSchedule: [[32, 33], [56, 60], [62, 64], [34, 36]]
    }
  }

  editDefaultSchedule = () => {
    this.setState({editingDefault: true})
  }

  onUpdateSchedule = (newValue) => {
    console.log('sc updated', newValue)
    this.setState({defaultSchedule: newValue})

  }

  addNewTime = () => {
    this.setState({addingNewTime: true})
  }

  handleAddNewAvailableTime = (ranges) => {
    console.log('adding new avail', ranges)

  }

  state = {}


  render() {
    let dayMap = {}
    _.each(this.state.defaultSchedule, (range) => {
      let day = Math.floor(range[0] / 24)
      dayMap[days[day]] = dayMap[days[day]] || []
      dayMap[days[day]].push(codeToTime(range[0], day) + ' - ' + codeToTime(range[1], day))
    })
    return <div>
      <h1>My Availability</h1>
      <h2>Available Time</h2>
      <ul>
        <li>Default Schedule</li>
        {Object.keys(dayMap).map(day =>
          <div key={day}>
            {day}: {dayMap[day].join(', ')}
          </div>)
        } <a onClick={this.editDefaultSchedule}>Edit</a>
        <li>Except From</li>
      </ul>
      <span onClick={this.addNewTime}>Add new available time</span>
      {this.state.addingNewTime && <AddNewTime onCancel={()=>this.setState({addingNewTime: false})} onAddNew={this.handleAddNewAvailableTime}/>}
      {this.state.editingDefault &&
      <EditScheduleGrid schedule={this.state.defaultSchedule} onUpdate={this.onUpdateSchedule}/>}

      <h2>Blocked Time</h2>
    </div>
  }
}


export default Scheduling
