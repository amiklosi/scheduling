import React from 'react'
import _ from 'lodash'
import TimeInput from 'time-input'
import styles from './EditScheduleGrid.scss'
import {codeToTime, timeToCode, days} from './date-utils'
import ClickToEditTime from './ClickToEditTime'

export default class EditScheduleGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {qq: '12:00', selection: _.clone(props.schedule)}
  }

  removeRange = (range) => {
    this.state.selection = _.reject(this.state.selection, s => s == range)
    this.setState({selection: this.state.selection})
    this.props.onUpdate(this.state.selection)
  }

  addNewRange(day) {
    let dayIndex = _.indexOf(days, day)
    let utc = dayIndex * 24
    this.state.selection.push([utc, utc])
    this.setState({})
    this.props.onUpdate(this.state.selection)
  }

  render() {

    let thead = _.map(days, day => <th key={day}>{day}</th>)
    let entryRow = _.map(days, day => {
      let cellClass = ''
      let dayIndex = _.indexOf(days, day)
      let rangesForDay = _(this.state.selection)
        .filter(s => Math.floor(s[0] / 24) == dayIndex)
        .map((v, i) => {
            let range = _.find(this.state.selection, s => s == v)
            let updateTime = idx => nv => {
              let hour = Number(nv.split(':')[0])
              let mins = Number(nv.split(':')[1])
              hour += mins / 60

              range[idx] = timeToCode(nv) + dayIndex * 24
              this.setState({selection: this.state.selection})
              this.props.onUpdate(this.state.selection)
            }

            return <div key={i} className={styles.hourInputsHolder}>
              <ClickToEditTime className={styles.hourInput} value={codeToTime(v[0], dayIndex)} onChange={updateTime(0)}/>
              -
              <ClickToEditTime className={styles.hourInput} value={codeToTime(v[1], dayIndex)} onChange={updateTime(0)}/>
              {/*<TimeInput className={styles.hourInput} value={codeToTime(v[1], dayIndex)} onChange={updateTime(1)}/>*/}
              <span onClick={this.removeRange.bind(this, range)}>x</span>
            </div>
          }
        )
        .value()
      return <td key={day} className={cellClass}>{rangesForDay}</td>
    })
    let addRow = _.map(days, day => <td className={styles.addButton} key={day} onClick={this.addNewRange.bind(this, day)}>+</td>)
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
