import React from 'react'
import PropTypes from 'react-proptypes'
import _ from 'lodash'
import styles from './SmashcutCalendar.scss'
import {codeToTime, isAvailable, isBookedTime, mondayBasedDays} from './date-utils'
import moment from 'moment'
import classnames from 'classnames'


export default class SmashcutCalendar extends React.Component {

  static propTypes = {
    startDate: PropTypes.object,
    cellRenderer: PropTypes.func,
    cellClick: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedTimeCode: undefined
    }
  }

  handleMouseOver = (timeCode) => {
    this.setState({selectedTimeCode: timeCode})
  }

  handleMouseOut = () => {
    this.setState({selectedTimeCode: undefined})
  }

  handleClick = (date) => {
    this.props.onBookSession(date)
  }

  getCellClass = (dayIdx, hourIdx) => {
    const cellCode = dayIdx * 24 + hourIdx
    const selectedTimeCode = _.get(this.state, 'selectedTimeCode')
    const isSelected = cellCode == selectedTimeCode// || cellCode == selectedTimeCode + 0.5
    return `${styles.cell} ${(isSelected ? styles.selected : '')}`
  }

  // onClick={this.handleClick.bind(this, this.props.startDate.clone().add(dayIdx, 'days').add(idx / 2, 'hours'))}>
  render() {
    const startDate = moment(this.props.startDate)// || moment()
    const table = <table className={styles.table}>
      <thead>
      <tr>
        <th className={styles.q}></th>
        {_.range(7).map(day => <th key={day} className={styles.headerCell}>
          <div className={styles.dayName}>{startDate.clone().add(day, 'days').format('dddd')}</div>
          <div className={styles.day}>{startDate.clone().add(day, 'days').format('D')}</div>

        </th>)}
      </tr>
      </thead>
      <tbody>
      {_.range(48).map(idx =>
        <tr key={idx}>
          <td className={styles.timeCell} width="80px">{codeToTime(idx / 2, 0)}</td>
          {_.range(7).map(dayIdx => {
              const timeCode = dayIdx % 7 * 24 + idx / 2
              return <td className={this.getCellClass(dayIdx, idx / 2)} key={dayIdx}
                         onMouseOver={this.handleMouseOver.bind(this, timeCode)}
                         onMouseOut={this.handleMouseOut}
                         onClick={this.props.cellClick.bind(this, timeCode)}>
                <div>{this.props.cellRenderer(timeCode)}</div>
                <div className={styles.debugInfo}>{timeCode}</div>
                &nbsp;
              </td>
            }
          )
          }
        </tr>)
      }
      </tbody>
    </table>

    return table
  }
}
