import React from 'react'
import Select from 'react-select'
import {codeToTime, pad, timeToCode, days} from './date-utils'

export default class ClickToEditTime extends React.Component {

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


  render() {
    return this.state.editing ? <span>
      <Select
        className="mySelect"
        name="form-field-name"
        value={this.state.toTime}
        options={this.options}
        onChange={this.handleToChange}
        matchProp='label'
        clearable={false}
      />
    </span>
      :
      <span onClick={() => this.setState({editing: true})}>
      {this.props.value}
        </span>
  }
}
