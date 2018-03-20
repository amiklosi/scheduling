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
    const table = <div className={styles.table}>
      <div className={styles.headerRow}>
        <div className={styles.headerCorner}>
          q
        </div>
        {_.range(7).map(day => {
          const date = startDate.clone().add(day, 'days')
          const isCurrent = date.isSame(moment(), 'day')
          console.log(date)
          return <div key={day} className={classnames(styles.headerCell, {[styles.currentDay]: isCurrent, [styles.firstColumn]: day == 0})}>
            <div className={styles.dayName}>{startDate.clone().add(day, 'days').format('dddd')}</div>
            <div className={styles.day}>{startDate.clone().add(day, 'days').format('D')}</div>

          </div>
        })}
      </div>
      <div className={styles.tableBody}>
        {_.range(48).map(idx =>
          <div className={styles.row} key={idx}>
            <div className={styles.timeCell} width="80px">{codeToTime(idx / 2, 0)}</div>
            {_.range(7).map(dayIdx => {
                const timeCode = dayIdx % 7 * 24 + idx / 2
                return <div className={classnames(this.getCellClass(dayIdx, idx / 2), {[styles.firstColumn]: dayIdx == 0})} key={dayIdx}
                            onMouseOver={this.handleMouseOver.bind(this, timeCode)}
                            onMouseOut={this.handleMouseOut}
                            onClick={this.props.cellClick.bind(this, timeCode)}>
                  <div>{this.props.cellRenderer(timeCode)}</div>
                  <div className={styles.debugInfo}>{timeCode}</div>
                  &nbsp;
                </div>
              }
            )
            }
          </div>)
        }
      </div>
    </div>

    return table
  }
}
