import React from 'react'
import Select from 'react-select'
import {codeToTime, pad, timeToCode, days} from './date-utils'
import styles from './ClickToEditTime.scss'
import onClickOutside from 'react-onclickoutside'


class ClickToEditTime extends React.Component {

  constructor(props) {
    super(props)
    let idx = 0
    let options = this.options = []

    for (let hour = 0; hour < 24; hour += 0.5) {
      options.push({value: idx++, timeCode: hour, label: codeToTime(hour, 0)})
    }

    this.toOptions = _.union(_.clone(options), [{value: idx++, timeCode: 24, label: codeToTime(24, 0)}])

    this.state = {}
    if (props.isDefault) {
      this.state = {editingFrom: true, editingTo: true}
    }
  }


  handleClickOutside = evt => {
    if (!this.props.isDefault) {
      this.setState({editingFrom: false, editingTo: false})
    }
  }

  filterOption = (option, filter) => {
    if (!filter) {
      return true
    }
    let label = option.label
    let filterTimePart = (filter.match(/[0-9:]+/) || [''])[0]
    let [filterH, filterM] = filterTimePart.split(':').map(v => _.isEmpty(v) ? undefined : Number(v))
    let filterAmPmPart = (filter.toLowerCase().match(/[ap]/) || [''])[0]
    let optionTimePart = (label.match(/[0-9:]+/) || [''])[0]
    let [optionH, optionM] = optionTimePart.split(':').map(v => _.isEmpty(v) ? undefined : Number(v))
    let optionAmPmPart = (label.toLowerCase().match(/[ap]/) || [''])[0]
    return (filterH == optionH)
      && (filterAmPmPart == '' || filterAmPmPart == optionAmPmPart)
      && (filterM == undefined || filterM == optionM || filterM * 10 == optionM)
  }

  optionIntersectsRange = (option, range) => {
    return option.timeCode >= range[0] && option.timeCode < range[1]
  }

  optionIntersectsAnyRange = (option) => {
    return _.some(this.props.existingRanges, range => this.optionIntersectsRange(option, range))
  }

  rangeIntersectRange = (existingRange, range) => {
    let res = (range[0] > existingRange[0] && range[0] < existingRange[1])
      || (range[1] > existingRange[0] && range[1] < existingRange[1])
      || (existingRange[0] > range[0] && existingRange[0] < range[1])
      || (existingRange[1] > range[0] && existingRange[1] < range[1])
    return res
  }

  rangeIntersectsAnyRange = (range) => {
    return _.some(this.props.existingRanges, existingRange => this.rangeIntersectRange(existingRange, range))
  }

  excludeIntersectingExisting = (toCode) => {
    return toCode ?
      _.filter(this.options, o => !this.rangeIntersectsAnyRange([o.timeCode, toCode]))
      :
      _.reject(this.options, o => this.optionIntersectsAnyRange(o))
  }

  handleFromChange = nv => {
    this.props.onFromChange(nv.timeCode)
    this.setState({editingFrom: false})
  }

  handleToChange = nv => {
    this.props.onToChange(nv.timeCode)
    this.setState({editingTo: false})
  }

  scrollRefTo9AM = (ref) => {
    setTimeout(() => {
      ref.menu.scrollTop = 530
    }, 10)
  }

  scrollFromTo9AM = () => this.scrollRefTo9AM(this.selectFromRef)

  render() {

    let fromIndex = (_.find(this.options, o => o.timeCode == this.props.fromValue) || {}).value
    let fromCode = this.props.fromValue
    let toIndex = (_.find(this.options, o => o.timeCode == this.props.toValue) || {}).value
    let toCode = this.props.toValue
    let filteredFromOptions = this.props.existingRanges ? this.excludeIntersectingExisting(toCode) : this.options
    let filteredToOptions = _.filter(this.toOptions, o => o.timeCode > fromCode && !this.rangeIntersectsAnyRange([fromCode, o.timeCode]))
    return <div className={styles.topContainer}>

      <div>
        from
      </div>

      {this.state.editingFrom ? <Select
        autofocus={this.props.autoFocusFrom}
        className={styles.clickEditInput}
        ref={r => this.selectFromRef = r}
        onOpen={this.scrollFromTo9AM}
        filterOption={this.filterOption}
        name="form-field-name"
        value={fromIndex}
        options={filteredFromOptions}
        onChange={this.handleFromChange}
        matchProp='label'
        clearable={false}
      /> : <div className={styles.timeLabel}
                onClick={() => this.setState({editingFrom: true})}>{codeToTime(this.props.fromValue, 0)}</div>
      }
      <div>
        to
      </div>
      {this.state.editingTo ? <Select
        className={styles.clickEditInput}
        filterOption={this.filterOption}
        name="form-field-name"
        value={toIndex}
        options={filteredToOptions}
        onChange={this.handleToChange}
        matchProp='label'
        clearable={false}
      /> : <div className={styles.timeLabel}
                onClick={() => this.setState({editingTo: true})}>{codeToTime(this.props.toValue, 0)}</div>}


      {!!toCode && <div>
        ({toCode - fromCode} hours)
      </div>}

    </div>
  }
}

export default onClickOutside(ClickToEditTime)
