import React from 'react'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import {timeToCode} from './date-utils.js'
import EditSchedule from './EditSchedule'

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
    this.props.onAddNew(this.state.startDate, this.state.endDate, this.state.schedule)
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

    return <div>
      <p>I am available during...</p>

      <div>
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
        <EditSchedule schedule={this.state.schedule} onUpdate={this.onUpdateSchedule} />
      </div>

      <div>
        <a onClick={this.handleSet}>Set</a>
        &nbsp;&nbsp;
        <a onClick={this.props.onCancel}>Cancel</a>
      </div>
    </div>
  }
}
