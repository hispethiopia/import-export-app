import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { CTX_DEFAULT } from '../../components/Form'
import { EventIcon } from '../../components/Icon'
import { FormBase } from '../../components/FormBase'
import { fetchLog } from './helpers'
import {
    getFormField,
    getFormFields,
    getFormValues,
    getParamsFromFormState,
    getUploadXHR,
} from '../../helpers'
import { isProduction } from '../../helpers/env'

export class EventImport extends FormBase {
    static path = '/import/event'

    static order = 3
    static title = i18n.t('Event Import')
    static desc = i18n.t(
        'Import events for programs, stages and tracked entities in the DXF 2 format.'
    )

    static menuIcon = <EventIcon />
    icon = <EventIcon />

    formWidth = 800
    formTitle = i18n.t('Event Import')
    submitLabel = i18n.t('Import')

    fields = [
        ...getFormFields(['upload', 'format', 'dryRun', 'eventIdScheme']),
        getFormField('orgUnitIdScheme', { context: CTX_DEFAULT }),
    ]

    state = getFormValues([
        'upload',
        'format:.json:json,xml,csv',
        'dryRun',
        'eventIdScheme',
        'orgUnitIdScheme',
    ])

    async componentDidMount() {
        await fetchLog('', 'EVENT_IMPORT')
    }

    onSubmit = async () => {
        try {
            const { upload, format } = this.getFormState()
            const formattedFormat = format.slice(1)

            const params = getParamsFromFormState(
                this.getFormState(),
                ['dryRun', 'eventIdScheme', 'orgUnitIdScheme'],
                [
                    'async=true',
                    'skipFirst=true',
                    `payloadFormat=${formattedFormat}`,
                ]
            )
            this.setProcessing()

            const { REACT_APP_DHIS2_BASE_URL } = process.env
            const url = `${REACT_APP_DHIS2_BASE_URL}/api/events.json?${params}`
            const xhr = getUploadXHR(
                url,
                upload,
                'EVENT_IMPORT',
                this.clearProcessing,
                this.assertOnError,
                formattedFormat
            )
            xhr.send(upload)
        } catch (e) {
            !isProduction && console.log('Event Import error', e, '\n')
        }
    }
}
