import React from 'react'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import TimeInput from 'time-input'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import EditScheduleGrid from './EditScheduleGrid'
import {timeToCode} from './date-utils.js'

export default class AddNewTime extends React.Component {

  handleStartDateChange = (date) => {
    this.setState({
      startDate: date
    })
  }

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date
    })
  }

  handleSet = () => {
    if (this.state.advanced) {
      this.props.onAddNew(this.state.startDate, this.state.endDate, this.state.schedule)
    } else {
      let fromTime = timeToCode(this.state.startTime)
      let toTime = timeToCode(this.state.endTime)
      this.props.onAddNew(this.state.startDate, this.state.startDate, [[fromTime, toTime]])
    }
  }

  onUpdateSchedule = (newValue) => {
    this.setState({schedule: newValue})

  }

  constructor(props) {
    super(props)
    this.state = {
      startTime: '12:00 AM',
      endTime: '12:00 AM',
      startDate: moment(),
      advanced: false,
      schedule: []
    }
  }

  render() {
    let basicView = <div>
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleStartDateChange}
        />

        <a onClick={() => this.setState({advanced: true, endDate: moment()})}>Use advanced</a>
      </div>

      <TimeInput value={this.state.startTime} onChange={nv => this.setState({startTime: nv})}/>
      to
      <TimeInput value={this.state.endTime} onChange={nv => this.setState({endTime: nv})}/>
    </div>
    let advancedView = <div>
      <div>
        From:
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleStartDateChange}
        />

        To:
        <DatePicker
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />

      </div>
      <EditScheduleGrid schedule={this.state.schedule} onUpdate={this.onUpdateSchedule} />
    </div>
    return <div>
      <p>I am available during...</p>

      {this.state.advanced ? advancedView : basicView}


      <div>
        <a onClick={this.handleSet}>Set</a>
        &nbsp;&nbsp;
        <a onClick={this.props.onCancel}>Cancel</a>
      </div>
    </div>
  }
}
