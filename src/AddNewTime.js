import React from 'react'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import TimeInput from 'time-input'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import EditScheduleGrid from './EditScheduleGrid'


export default class AddNewTime extends React.Component {

  handleChange = (date) => {
    this.setState({
      startDate: date
    })
  }

  handleSet = () => {
    if (this.state.advanced) {
      this.props.onAddNew(this.state.schedule)
    } else {
      this.props.onAddNew([[0,8]])
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
          onChange={this.handleChange}
        />

        <a onClick={() => this.setState({advanced: true})}>Use advanced</a>
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
          onChange={this.handleChange}
        />

        To:
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
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
