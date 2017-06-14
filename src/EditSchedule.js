import React from 'react'
import _ from 'lodash'
import styles from './EditSchedule.scss'
import {codeToTime, timeToCode, normalizeCodeToDay, days, longDays, mondayBasedlongDays} from './date-utils'
import ClickToEditTime from './ClickToEditTime'
import FontIcon from 'react-toolbox/lib/font_icon'

export default class EditSchedule extends React.Component {
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

    let updateTime = (dayIndex, range, rangeIdx, nv) => {
      range[rangeIdx] = nv + dayIndex * 24
      if (rangeIdx == 0 && range[1] <= range[0]) {
        range[1] = range[0] + 0.5
      }
      this.setState({selection: this.state.selection})
      this.props.onUpdate(this.state.selection)
    }

    let addOrUpdateTime = (dayIndex, rangeIdx, nv) => {
      let rangesForDay = _(this.state.selection)
        .filter(s => s.length == 1 && Math.floor(s[0] / 24) == dayIndex).value()

      if (_.isEmpty(rangesForDay)) {
        let newRange = []
        this.state.selection.push(newRange)
        updateTime(dayIndex, newRange, rangeIdx, nv)
      } else {
        updateTime(dayIndex, rangesForDay[0], rangeIdx, nv)
        if (rangeIdx == 1) {
          this.setState({addingNewForDay: undefined})
        }
      }
    }


    let entryRow = (dayIndex) => {
      let cellClass = ''
      let rangesForDay = _(this.state.selection)
        .filter(s => s.length == 2 && Math.floor(s[0] / 24) == dayIndex)
        .sortBy([v => v[0]])
        .map((v, i, filteredList) => {
            let range = _.find(this.state.selection, s => s == v)
            let existingRangesForDay = _(this.state.selection)
              .filter(s => s.length == 2 && Math.floor(s[0] / 24) == dayIndex && s != range)
              .map(ranges => ranges.map(rangeValue => rangeValue - dayIndex * 24))
              .value()

            return <div key={i} className={styles.dayRow}>
              <ClickToEditTime
                className={styles.hourInput}
                fromValue={normalizeCodeToDay(v[0], dayIndex)}
                toValue={normalizeCodeToDay(v[1], dayIndex)}
                existingRanges={existingRangesForDay}
                onFromChange={updateTime.bind(this, dayIndex, range, 0)}
                onToChange={updateTime.bind(this, dayIndex, range, 1)}
              />
              <FontIcon className={styles.button} value='delete' onClick={this.removeRange.bind(this, range)}/>
              {this.state.addingNewForDay !== dayIndex && i == filteredList.length - 1 &&
              <FontIcon className={styles.button} value='add'
                        onClick={() => this.setState({addingNewForDay: dayIndex})}/>}

            </div>
          }
        )
        .value()

      let newInputValues = _.filter(this.state.selection, s => s.length == 1 && Math.floor(s[0] / 24) == dayIndex)
      let existingRangesForDay = _(this.state.selection)
        .filter(s => s.length == 2 && Math.floor(s[0] / 24) == dayIndex)
        .map(ranges => ranges.map(rangeValue => rangeValue - dayIndex * 24))
        .value()
      let addingNewInput = <ClickToEditTime
        className={styles.hourInput}
        isDefault={true}
        autoFocusFrom={!!this.state.addingNewForDay}
        existingRanges={existingRangesForDay}
        fromValue={normalizeCodeToDay(newInputValues[0], dayIndex)}
        toValue={normalizeCodeToDay(newInputValues[1], dayIndex)}
        onFromChange={addOrUpdateTime.bind(this, dayIndex, 0)}
        onToChange={addOrUpdateTime.bind(this, dayIndex, 1)}
      />

      let addingNew = _.isEmpty(rangesForDay) || dayIndex == this.state.addingNewForDay

      return <div key={dayIndex} className={cellClass}>
        {rangesForDay}
        {addingNew && addingNewInput}
      </div>
    }
    let table = <div className={styles.scheduleTable}>
      {mondayBasedlongDays.map(day => {
        let idx = _.indexOf(longDays, day)
        return <div key={idx} className={styles.row}>
          <div className={styles.dayLabel}>{day}s</div>
          {entryRow(idx)}
        </div>
      })
      }

    </div>
    return <div>{table} {JSON.stringify(this.state.selection)}</div>
  }
}
