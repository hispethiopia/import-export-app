import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DatePicker } from '../index'
import { DateEthiopian } from './utils/DateEthiopian'
const { Field } = ReactFinalForm

const OPTIONAL_DATE_VALIDATOR = date =>
    date ? DATE_VALIDATOR(date) : undefined
const DATE_VALIDATOR = date => {
    return false ? i18n.t('Invalid date') : undefined
}

/**
 * 
 * @param {string} d1 The first date to compare
 * @param {string} d2 The second date to compare
 * @returns Returns number (1 if d1>d2, 0 if d1==d2 and -1 if d1<d2)
 */
const compareDates = (d1, d2) => {
    let day1 = new DateEthiopian(d1)
    let day2 = new DateEthiopian(d2)

    if (day1.year > day2.year) {
        return 1
    }
    if (day1.year === day2.year && day1.month > day2.month) {
        return 1
    }
    if (day1.year === day2.year && day1.month === day2.month && day1.date > day2.date) {
        return 1
    }
    if (day1.year === day2.year && day1.month === day2.month && day1.date === day2.date) {
        return 0
    }
    return -1;
}
const DATE_BEFORE_VALIDATOR = (date1, date2) => {
    const val = compareDates(date1, date2)

    if (val === 1 || val === 0) {
        return i18n.t('Start date must be before end date')
    }
    return undefined;
}
const DATE_AFTER_VALIDATOR = (date2, date1) => {

    const val = compareDates(date1, date2)

    if (val === 1 || val === 0) {
        return i18n.t('End date must be after start date')
    }
    return undefined;
}

const Wrapper = ({
    input: { value, onChange },
    meta: { error },
    inputName,
    ...rest
}) => (

    <DatePicker
        name={inputName}
        error={error}
        date={value}
        onChange={(e) => { onChange(e) }}
        {...rest}
    />
)

Wrapper.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.string,
        onChange: PropTypes.func,
    }).isRequired,
    inputName: PropTypes.string.isRequired,
    meta: PropTypes.shape({
        error: PropTypes.string,
        pristine: PropTypes.bool,
        touched: PropTypes.bool,
    }).isRequired,
}

const DatePickerField = ({ name, validator, ...rest }) => {
    const { baseUrl, systemInfo } = useConfig()
    return (
        <Field
            calendar={systemInfo.calendar}
            component={Wrapper}
            name={name}
            validate={validator}
            inputName={name}
            {...rest}
        />
    )
}

DatePickerField.propTypes = {
    name: PropTypes.string.isRequired,
    validator: PropTypes.func,
}

export {
    DatePickerField,
    DATE_VALIDATOR,
    DATE_BEFORE_VALIDATOR,
    DATE_AFTER_VALIDATOR,
    OPTIONAL_DATE_VALIDATOR,
}
