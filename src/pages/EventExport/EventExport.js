import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm } from '@dhis2/ui'
import React, { useState } from 'react'
import {
    Page,
    MoreOptions,
    BasicOptions,
    SchemeContainer,
    EventIcon,
    ValidationSummary,
} from '../../components/index.js'
import {
    OrgUnitTree,
    ProgramPicker,
    Format,
    formatOptions,
    defaultFormatOption,
    Compression,
    defaultCompressionOption,
    Dates,
    StartDate,
    EndDate,
    IncludeDeleted,
    Inclusion,
    defaultInclusionOption,
    ExportButton,
    ProgramStages,
    DataElementIdScheme,
    defaultDataElementIdSchemeOption,
    OrgUnitIdScheme,
    defaultOrgUnitIdSchemeOption,
    IdScheme,
    defaultIdSchemeOption,
} from '../../components/Inputs/index.js'
import { onExport, validate } from './form-helper.js'
import { DateEthiopian } from '../../components/DatePicker/utils/DateEthiopian.js'

const { Form } = ReactFinalForm

// PAGE INFO
export const PAGE_NAME = i18n.t('Event export')
export const PAGE_DESCRIPTION = i18n.t(
    'Export event data for programs, stages and tracked entities in DXF 2 format.'
)
const PAGE_ICON = <EventIcon />

let todayEthiopian = new DateEthiopian()
let threeMonthsAgo = new DateEthiopian(todayEthiopian.getMonth() > 2 ? todayEthiopian.getFullYear() : todayEthiopian.getFullYear() - 1, todayEthiopian.getMonth() > 2 ? todayEthiopian.getMonth() - 3 : (12 - 3 + todayEthiopian.getMonth()), todayEthiopian.getDate())


const initialValues = {
    selectedOrgUnits: [],
    selectedPrograms: '',
    programStage: undefined,
    format: defaultFormatOption,
    compression: defaultCompressionOption,
    startDate: threeMonthsAgo.toISOString(),
    endDate: todayEthiopian.toISOString(),
    includeDeleted: false,
    dataElementIdScheme: defaultDataElementIdSchemeOption,
    orgUnitIdScheme: defaultOrgUnitIdSchemeOption,
    idScheme: defaultIdSchemeOption,
    inclusion: defaultInclusionOption,
}

const EventExport = () => {
    const [exportEnabled, setExportEnabled] = useState(true)
    const { baseUrl } = useConfig()
    const onSubmit = onExport(baseUrl, setExportEnabled)

    return (
        <Page
            title={PAGE_NAME}
            desc={PAGE_DESCRIPTION}
            icon={PAGE_ICON}
            loading={!exportEnabled}
            dataTest="page-export-data"
        >
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                subscription={{
                    values: true,
                }}
                render={({ handleSubmit, form, values }) => (
                    <form onSubmit={handleSubmit}>
                        <BasicOptions>
                            <OrgUnitTree multiSelect={false} />
                            <Inclusion />
                            <ProgramPicker autoSelectFirst />
                            <ProgramStages
                                selectedProgram={values.selectedPrograms}
                                form={form}
                            />
                            <Dates
                                label={i18n.t('Date range to export data for')}
                            >
                                <StartDate />
                                <EndDate />
                            </Dates>
                            <Format availableFormats={formatOptions} />
                            <Compression />
                        </BasicOptions>
                        <MoreOptions>
                            <IncludeDeleted />
                            <SchemeContainer>
                                <DataElementIdScheme />
                                <OrgUnitIdScheme />
                                <IdScheme />
                            </SchemeContainer>
                        </MoreOptions>
                        <ValidationSummary />
                        <ExportButton
                            label={i18n.t('Export events')}
                            disabled={!exportEnabled}
                        />
                    </form>
                )}
            />
        </Page>
    )
}

export { EventExport }
