import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    RadioGroupContainer,
    RadioGroupLabel,
} from '../FinalFormComponents/RadioGroup'
import { Select } from '../FinalFormComponents/Select'

export const OPTION_UID = { value: 'UID', label: i18n.t('Uid') }
export const OPTION_CODE = { value: 'CODE', label: i18n.t('Code') }
export const OPTION_NAME = { value: 'NAME', label: i18n.t('Name') }

export const ORG_UNIT_ID_SCHEME_DEFAULT_OPTIONS = [
    OPTION_UID,
    OPTION_CODE,
    OPTION_NAME,
]
export const ORG_UNIT_ID_SCHEME_KEY = 'orgUnitIdScheme'
export const ORG_UNIT_ID_SCHEME_DEFAULT_VALUE = OPTION_UID.value

const orgUnitIdSchemeLabel = i18n.t('Org unit id scheme')
export const OrgUnitIdScheme = ({ options }) => (
    <Select
        name={ORG_UNIT_ID_SCHEME_KEY}
        label={orgUnitIdSchemeLabel}
        options={options}
        data-test-id="input-org-unit-id-scheme"
    />
)

OrgUnitIdScheme.propTypes = {
    options: Select.propTypes.options,
}

OrgUnitIdScheme.defaultProps = {
    options: ORG_UNIT_ID_SCHEME_DEFAULT_OPTIONS,
}

export const OrgUnitIdSchemeLoading = () => (
    <RadioGroupContainer>
        <RadioGroupLabel>{orgUnitIdSchemeLabel}</RadioGroupLabel>
        {i18n.t('Loading organisation unit id scheme options...')}
    </RadioGroupContainer>
)