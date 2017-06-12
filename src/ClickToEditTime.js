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
    for (let min = 0; min < 60; min += 30) {
      options.push({value: idx++, label: pad(12) + ':' + pad(min) + ' AM'})
    }

    for (let i = 1; i < 12; i++) {
      for (let min = 0; min < 60; min += 30) {
        options.push({value: idx++, label: pad(i) + ':' + pad(min) + ' AM'})
      }
    }
    for (let min = 0; min < 60; min += 30) {
      options.push({value: idx++, label: pad(12) + ':' + pad(min) + ' PM'})
    }

    for (let i = 1; i < 12; i++) {
      for (let min = 0; min < 60; min += 30) {
        options.push({value: idx++, label: pad(i) + ':' + pad(min) + ' PM'})
      }
    }
  }

  state = {}

  handleClickOutside = evt => {
    this.setState({editingFrom: false, editingTo: false})
  }

  render() {
    console.log('qqq', this.props.fromValue)
    let fromIndex = (_.find(this.options, o => o.label == this.props.fromValue) || {}).value
    let toIndex = (_.find(this.options, o => o.label == this.props.toValue) || {}).value
    let filteredOptions = _.filter(this.options, o => o.value > fromIndex)
    return <div className={styles.topContainer}>
      {this.state.editingFrom ? <Select
        autofocus={true}
        className={styles.clickEditInput}
        onBlur={() => this.setState({editingFrom: false})}
        name="form-field-name"
        value={fromIndex}
        options={this.options}
        onChange={nv => this.props.onFromChange(nv.label)}
        matchProp='label'
        clearable={false}
      /> : <span onClick={() => this.setState({editingFrom: true})}>{this.props.fromValue}</span>
      }
      -
      {this.state.editingTo ? <Select
        autofocus={true}
        className={styles.clickEditInput}
        onBlur={() => this.setState({editingTo: false})}
        name="form-field-name"
        value={toIndex}
        options={filteredOptions}
        onChange={nv => this.props.onToChange(nv.label)}
        matchProp='label'
        clearable={false}
      /> : <span onClick={() => this.setState({editingTo: true})}>{this.props.toValue}</span>}
    </div>
  }
}

export default onClickOutside(ClickToEditTime)
