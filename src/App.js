import React from 'react'
import _ from 'lodash'
import EditSchedule from "./EditSchedule";

class Scheduling extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      defaultSchedule: [
        [32, 40],
        [56, 60],
        [62, 64],
      ]
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(np) {
  }

  editDefaultSchedule = () => {
    this.setState({editingDefault: true})
  }

  onUpdateSchedule = (newValue) => {
    console.log('sc updated', newValue)

  }

  state = {}


  render() {
    let s = _.map(this.state.defaultSchedule, (range) => {
      let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      let day = Math.floor(range[0] / 24)
      let hourBegin = range[0] - day * 24
      let hourEnd = range[1] - day * 24
      return days[day] + ': ' + hourBegin + ' - ' + hourEnd
    }).join(', ')
    return <div>
      <h1>My Availability</h1>
      <h2>Available Time</h2>
      <h3>Default Schedule</h3>
      {s} <a onClick={this.editDefaultSchedule}>Edit</a>
      {this.state.editingDefault &&
      <EditSchedule schedule={this.state.defaultSchedule} onUpdate={this.onUpdateSchedule}/>}

      <h2>Blocked Time</h2>
    </div>
  }
}


export default Scheduling
