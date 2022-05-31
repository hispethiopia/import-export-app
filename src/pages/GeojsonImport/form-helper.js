import { FORM_ERROR, jobStartedMessage } from '../../utils/final-form'
import { uploadFile } from '../../utils/helper'

// const isAsync = true
const isAsync = false

// https://github.com/dhis2/dhis2-docs/pull/1006

const onImport = ({
    baseUrl,
    setProgress,
    addTask,
    setShowFullSummaryTask,
}) => async values => {
    const {
        dryRun,
        files,
        // orgUnitIdScheme,
        useAttribute,
        // geojsonProperty,
        geojsonAttribute,
    } = values

    // send xhr
    const apiBaseUrl = `${baseUrl}/api/`
    const endpoint = 'organisationUnits/geometry'
    const params = {
        dryRun,
        // geoJsonId: false,
        // geoJsonProperty: 'name',
        // orgUnitProperty: 'name',
    }

    if (useAttribute && geojsonAttribute) {
        console.log('attributeId', geojsonAttribute)
    }

    const url = `${apiBaseUrl}${endpoint}?${Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')}`

    console.log('onImport', values)

    // Error:
    // http://localhost:8080/api/organisationUnits/geometry?dryRun=true&orgUnitProperty=code
    // http://localhost:8080/api/organisationUnits/geometry?dryRun=true&geoJsonId=false&geoJsonProperty=id&orgUnitProperty=code [no content]

    try {
        await uploadFile({
            url,
            file: files[0],
            format: 'geojson',
            type: 'GEOJSON_IMPORT',
            isAsync: isAsync,
            setProgress,
            addEntry: (id, entry) =>
                addTask('geojson', id, { ...entry, jobDetails: values }),
        })
        return jobStartedMessage
    } catch (e) {
        const errors = [e]
        return { [FORM_ERROR]: errors }
    } finally {
        setShowFullSummaryTask(true)
    }
}

export { onImport }
