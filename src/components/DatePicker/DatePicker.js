import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { CalendarEthiopian } from './utils/CalendarEthiopian'
import { ethiopian } from './utils/ConstantEthoipian'
import { DayEthiopian } from './utils/CalendarEthiopian'
import { Calendar, Day } from './utils/CalendarGregorian'


const styles = `
.main-div {
    position: relative;
}
.date-toggle {
    padding: 8px 15px;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #eee;
    color: #333;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    text-transform: capitalize;
  }
  
  .calendar-dropdown {
    display: none;
    width: 300px;
    height: 300px;
    position: absolute;
    transform: translate(0, 8px);
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px rgba(0,0,0,0.2);
    z-index: 10;
  }
  
  .calendar-dropdown.top {
    top: auto;
    bottom: 100%;
    transform: translate(-50%, -8px);
  }
  
  .calendar-dropdown.left {
    top: 50%;
    left: 0;
    transform: translate(calc(-8px + -100%), -50%);
  }
  
  .calendar-dropdown.right {
    top: 50%;
    left: 100%;
    transform: translate(8px, -50%);
  }
  
  .calendar-dropdown.visible {
    display: block;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0 30px;
  }
  
  .header h4 {
    margin: 0;
    text-transform: capitalize;
    font-size: 21px;
    font-weight: bold;
  }
  
  .header button {
    padding: 0;
    border: 8px solid transparent;
    width: 0;
    height: 0;
    border-radius: 2px;
    border-top-color: #222;
    transform: rotate(90deg);
    cursor: pointer;
    background: none;
    position: relative;
  }
  
  .header button::after {
    content: '';
    display: block;
    width: 25px;
    height: 25px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  .header button:last-of-type {
    transform: rotate(-90deg);
  }
  
  .week-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px;
    margin-bottom: 10px;
  }
  
  .week-days span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    text-transform: capitalize;
  }
  
  .month-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px;
  }
  
  .month-day {
    padding: 8px 5px;
    background: #A0ADBA;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    cursor: pointer;
    border: none;
  }
  
  .month-day.current {
    background: #147cd7;
  }
  
  .month-day.selected {
    background: #28a5a7;
    color: #ffffff;
  }
  
  .month-day:hover {
    background: #34bd61;
  }

  .disabled {
    
    cursor: not-allowed !important;
}

`

const DatePicker = ({
    name,
    error,
    label,
    value,
    onChange,
    dataTest,
    date,
    calendar,
    onBlur,
    onFocus,
    startDate,
    endDate
}) => {


    let lang = window.navigator.language

    const [visible, setVisible] = React.useState(false)
    const [timeoutId, setTimeoutId] = React.useState(null)
    const [dateObject, setDateObject] = React.useState(null)
    const [calendarObject, setCalendarObject] = React.useState(null)

    React.useEffect(() => {
    }, [calendarObject])

    /**
     * This use effect initializes the values
     */
    React.useEffect(() => {
        let dateObject = calendar === ethiopian.ETHIOPIAN_NAME ? new DayEthiopian(date ? date : null) : new Day(date ? date : null)
        setDateObject(dateObject)
        setCalendarObject(
            calendar === ethiopian.ETHIOPIAN_NAME ?
                new CalendarEthiopian(dateObject.year, dateObject.monthNumber - 1, null) :
                new Calendar(dateObject.year, dateObject.monthNumber - 1, lang)
        )
    }, [date])

    const createHandlerPayload = (e) => {
        return e
    }

    const handleFocus = (e) => {
        if (onFocus) {
            onFocus()
        }
    }

    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(createHandlerPayload(e), e)
        }
    }

    const handleChange = (e) => {
        if (onChange) {
            onChange(createHandlerPayload(e), e)
        }
    }

    const handleDayClick = (day) => {
        handleChange(day.format("YYYY-MM-DD"))
        toggleVisible(false)

    }

    const toggleVisible = (visibility) => {
        if (visibility) {
            setVisible(true)
            clearTimeout(timeoutId)
            handleFocus()
        }

        if (!visibility && visible) {
            setTimeoutId(setTimeout(() => {
                setVisible(false)
                handleBlur()
            }))
        }
    }


    let getWeekDaysElementStrings = () => {
        return calendarObject.weekDays.map(
            (weekDay, index) => (
                <span key={`${weekDay}${index}`}>{
                    weekDay.substring(0, 3)
                }
                </span>
            )
        )
    }

    let getMonthDaysGrid = () => {
        let firstDayOfTheMonth = calendarObject.month.getDay(1)
        let prevMonth = calendarObject.getPreviousMonth();
        let totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;

        if (prevMonth.numberOfDays <= totalLastMonthFinalDays) {
            //This means that the month doesn't contain enough days to fill out the remaining
            //days of the first week of this month. This might only happen if the previous month is puagme
            totalLastMonthFinalDays = prevMonth.numberOfDays
        }

        const totalDays = calendarObject.month.numberOfDays + totalLastMonthFinalDays

        const monthList = Array.from({ length: totalDays })

        for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
            monthList[i] = calendarObject.month.getDay(i + 1 - totalLastMonthFinalDays)
        }

        for (let i = 0; i < totalLastMonthFinalDays; i++) {
            const inverted = totalLastMonthFinalDays - (i + 1)
            monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted)
        }

        return monthList
    }

    let monthYear
    let startDateObject
    let endDateObject

    let prevMonthDisabled
    let nextMonthDisabled
    if (calendarObject && dateObject) {
        //const value = dateObject && jsDateToISO8601(dateObject)
        monthYear = `${calendarObject.month.name},${calendarObject.year}`
        startDateObject = startDate ? new DayEthiopian(startDate) : null
        endDateObject = endDate ? new DayEthiopian(endDate) : null

        prevMonthDisabled = startDateObject &&
            startDateObject.year >= calendarObject.year &&
            startDateObject.monthNumber >= calendarObject.month.number

        nextMonthDisabled = endDateObject &&
            endDateObject.year <= calendarObject.year &&
            endDateObject.monthNumber <= calendarObject.month.number
    }
    return (<div>
        {dateObject && calendarObject &&
            <div className='main-div' onFocus={() => {
                toggleVisible(true)
            }}

                onBlur={() => {
                    toggleVisible(false)
                }
                }>
                <InputField className='data-toggle'
                    value={dateObject.format("YYYY-MM-DD")}
                    error={error ? true : false}
                    validationText={error}
                >
                </InputField>

                <div className={`calendar-dropdown ${visible ? 'visible' : ''}`}>
                    <div className='header'>
                        <button type="button"
                            disabled={prevMonthDisabled}
                            onClick={
                                () => {
                                    toggleVisible(true)
                                    calendarObject.goToPreviousMonth()
                                    let newCalendarObject = calendar === ethiopian.ETHIOPIAN_NAME ? new CalendarEthiopian(calendarObject.year, calendarObject.month.number - 1) : new Calendar(calendarObject.year, calendarObject.month.number - 1)
                                    setCalendarObject(newCalendarObject)
                                }
                            } className={`prev-month ${prevMonthDisabled ? "disabled" : ""}`}
                        >
                        </button>
                        <h4 tabIndex="0">{monthYear}</h4>
                        <button type="button"
                            disabled={nextMonthDisabled}
                            onClick={
                                () => {
                                    toggleVisible(true)
                                    calendarObject.goToNextMonth()
                                    let newCalendarObject = calendar === ethiopian.ETHIOPIAN_NAME ? new CalendarEthiopian(calendarObject.year, calendarObject.month.number - 1) : new Calendar(calendarObject.year, calendarObject.month.number - 1)
                                    setCalendarObject(newCalendarObject)
                                }
                            } className={`next-month ${nextMonthDisabled ? "disabled" : ""}`}
                        >
                        </button>
                    </div>
                    <div className='week-days'>{getWeekDaysElementStrings()}</div>
                    <div className='month-days'>
                        {getMonthDaysGrid().map(day => {
                            let dateDisabled = startDateObject &&
                                (
                                    (startDateObject.year > day.year) ||
                                    (startDateObject.year === day.year && startDateObject.monthNumber > day.monthNumber) ||
                                    (startDateObject.year === day.year && startDateObject.monthNumber === day.monthNumber && startDateObject.date >= day.date)
                                )

                            dateDisabled = dateDisabled || (
                                endDateObject &&
                                (
                                    (endDateObject.year < day.year) ||
                                    (endDateObject.year === day.year && endDateObject.monthNumber < day.monthNumber) ||
                                    (endDateObject.year === day.year && endDateObject.monthNumber === day.monthNumber && endDateObject.date <= day.date)
                                )
                            )


                            return <button
                                key={`${name}-${day.format('YYYY-MM-DD')}`}
                                className={`month-day ${(day.monthNumber === calendarObject.month.number &&
                                    !dateDisabled) ? 'current' : 'disabled'}
                            `}
                                onClick={
                                    dateDisabled || day.monthNumber !== calendarObject.month.number ?
                                        undefined : (e) => {
                                            e.preventDefault();
                                            handleDayClick(day)
                                        }
                                }
                            >
                                {day.date}
                            </button>
                        }
                        )}
                    </div>
                </div>
                <style >
                    {styles}
                </style>
            </div>
        }
    </div>
    )
}

DatePicker.propTypes = {
    dataTest: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
        .isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
}

export { DatePicker }
