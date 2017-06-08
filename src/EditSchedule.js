import React from 'react'
import _ from 'lodash'
import TimeInput from 'time-input'
import styles from './EditSchedule.scss'
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export default class EditSchedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {qq: '12:00', selection: _.clone(props.schedule)}
  }

  removeRange = (range) => {
    this.setState({selection: _.reject(this.state.selection, s => s == range)})
  }

  addNewRange(day) {
    let dayIndex = _.indexOf(days, day)
    let utc = dayIndex * 24
    this.state.selection.push([utc, utc])
    this.setState({})
  }

  render() {

    let thead = _.map(days, day => <th key={day}>{day}</th>)
    let pad = (n) => n < 10 ? '0' + n : n
    let entryRow = _.map(days, day => {
      let cellClass = ''
      let dayIndex = _.indexOf(days, day)
      let codeToTime = (code) => {
        let h = Math.floor(code)
        let m = code == h ? '00' : '30'
        let val = pad(h - dayIndex * 24) + ':' + m
        return val
      }
      let rangesForDay = _(this.state.selection)
        .filter(s => Math.floor(s[0] / 24) == dayIndex)
        .map((v, i) => {
            let range = _.find(this.state.selection, s => s == v)
            let updateTime = idx => nv => {
              let hour = Number(nv.split(':')[0])
              let mins = Number(nv.split(':')[1])
              hour += mins / 60

              range[idx] = hour + dayIndex * 24
              this.setState({selection: this.state.selection})
            }

            return <div key={i} className={styles.hourInputsHolder}>
              <TimeInput className={styles.hourInput} value={codeToTime(v[0])} onChange={updateTime(0)}/>
              -
              <TimeInput className={styles.hourInput} value={codeToTime(v[1])} onChange={updateTime(1)}/>
              <span onClick={this.removeRange.bind(this, range)}>x</span>
            </div>
          }
        )
        .value()
      return <td key={day} className={cellClass}>{rangesForDay}</td>
    })
    let addRow = _.map(days, day => <td key={day} onClick={this.addNewRange.bind(this, day)}>Add</td>)
    let tbody = <tbody>
    <tr>
      {entryRow}
    </tr>
    <tr>
      {addRow}
    </tr>
    </tbody>

    let table = <table className={styles.scheduleTable}>
      <thead>
      <tr>
        {thead}
      </tr>
      </thead>
      {tbody}
    </table>
    return <div>{JSON.stringify(this.state.selection)}<br/>{table}</div>
  }
}
