import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Field, Switch as SwitchUI } from '@dhis2/ui-forms'

import { FormField } from '../index'

const Wrapper = ({ input, meta, ...rest }) => (
    <SwitchUI
        input={input}
        meta={meta}
        label={input.value ? i18n.t('Yes') : i18n.t('No')}
        {...rest}
    />
)

Wrapper.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
}

const Switch = ({ name, label, help, dataTest }) => {
    return (
        <FormField label={label} dataTest={dataTest}>
            <Field
                component={Wrapper}
                name={name}
                helpText={help}
                dataTest={`${dataTest}-sf`}
            />
        </FormField>
    )
}

Switch.propTypes = {
    dataTest: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    help: PropTypes.string,
}

export { Switch }
