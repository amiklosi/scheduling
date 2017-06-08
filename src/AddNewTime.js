import React from 'react'
import _ from 'lodash'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TimeInput from 'time-input'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'


export default class AddNewTime extends React.Component {

  handleChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  constructor(props) {
    super(props)
    this.state = {
      startTime: '12:00',
      endTime: '12:00',
      startDate: moment(),
      advanced: false
    }
  }

  render() {
    return <div>
      <p>I am available during...</p>

      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
      </div>

      <TimeInput value={this.state.startTime} onChange={nv => this.setState({startTime: nv})}/>
      to
      <TimeInput value={this.state.endTime} onChange={nv => this.setState({endTime: nv})}/>


      <div>
        <a>Set</a>
        <a onClick={this.props.onCancel}>Cancel</a>
      </div>
    </div>
  }
}
