import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { apiConfig } from 'config'
import { api, eventEmitter } from 'services'
import { FormBase } from 'components/FormBase'
import {
  CTX_DEFAULT,
  TYPE_FILE,
  TYPE_RADIO,
  CTX_CSV_OPTION,
  CTX_MORE_OPTIONS,
  TYPE_MORE_OPTIONS
} from 'components/Form'
import { MetadataImportIcon } from 'components/Icon'

function parseLog(title, v) {
  const list = []

  list.push(title)
  if (!Array.isArray(v.value)) {
    list.push(`\tpath: ${v.path}, value: ${v.value}`)
  } else {
    if (v.path === 'translations') {
      list.push('\tTranslations')
      list.push(
        v.value
          .map(
            vi => `\t${vi.locale}\tproperty: ${vi.property}, value: ${vi.value}`
          )
          .join('\n')
      )
    } else if (typeof v.value[0]['name'] === 'string') {
      list.push(v.value.map(vi => `\t${vi.name}`).join('\n'))
    } else if (typeof v.value[0]['dataElement'] === 'object') {
      list.push('\tDataSet/DataElement')
      v.value.forEach(({ dataSet, dataElement }) => {
        list.push(`\t${dataElement.name}: ${dataSet.displayName}`)
      })
    } else {
      console.warn('un-parsed log', v)
    }
  }

  return list.join('\n')
}

function operationAddition(v) {
  return parseLog('Addition', v)
}

function operationDeletion(v) {
  return parseLog('Deletion', v)
}

export class MetaDataImport extends FormBase {
  static path = '/import/metadata'

  static order = 1
  static menuIcon = <MetadataImportIcon />
  static title = i18n.t('Metadata Import')
  icon = <MetadataImportIcon />

  formWidth = 600
  formTitle = i18n.t('Metadata Import')
  submitLabel = i18n.t('Import')

  fields = [
    {
      context: CTX_DEFAULT,
      type: TYPE_FILE,
      name: 'upload',
      label: null
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'importMode',
      label: i18n.t('Import Mode')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'identifier',
      label: i18n.t('Identifier')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'importReportMode',
      label: i18n.t('Report Mode')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'preheatMode',
      label: i18n.t('Preheat Mode')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'importStrategy',
      label: i18n.t('Import Strategy')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'atomicMode',
      label: i18n.t('Atomic Mode')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'mergeMode',
      label: i18n.t('Merge Mode')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_MORE_OPTIONS
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'flushMode',
      label: i18n.t('Flush Mode')
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'skipSharing',
      label: i18n.t('Skip Sharing')
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'skipValidation',
      label: i18n.t('Skip Validation')
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'async',
      label: i18n.t('Async')
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'inclusionStrategy',
      label: i18n.t('Inclusion Strategy')
    }
  ]

  state = {
    _context: CTX_DEFAULT,
    processing: false,

    upload: {
      selected: null
    },

    importMode: {
      selected: 'COMMIT',
      values: [
        {
          value: 'COMMIT',
          label: i18n.t('Commit')
        },
        {
          value: 'VALIDATE',
          label: i18n.t('Validate')
        }
      ]
    },
    identifier: {
      selected: 'UID',
      values: [
        {
          value: 'UID',
          label: i18n.t('UID')
        },
        {
          value: 'CODE',
          label: i18n.t('CODE')
        },
        {
          value: 'AUTO',
          label: i18n.t('AUTO')
        }
      ]
    },
    importReportMode: {
      selected: 'ERRORS',
      values: [
        {
          value: 'ERRORS',
          label: i18n.t('Errors')
        },
        {
          value: 'FULL',
          label: i18n.t('Full')
        },
        {
          value: 'DEBUG',
          label: i18n.t('Debug')
        }
      ]
    },
    preheatMode: {
      selected: 'REFERENCE',
      values: [
        {
          value: 'REFERENCE',
          label: i18n.t('Reference')
        },
        {
          value: 'ALL',
          label: i18n.t('All')
        },
        {
          value: 'NONE',
          label: i18n.t('None')
        }
      ]
    },
    importStrategy: {
      selected: 'CREATE_AND_UPDATE',
      values: [
        {
          value: 'CREATE_AND_UPDATE',
          label: i18n.t('Create and Update')
        },
        {
          value: 'CREATE',
          label: i18n.t('Create')
        },
        {
          value: 'UPDATE',
          label: i18n.t('Update')
        },
        {
          value: 'DELETE',
          label: i18n.t('Delete')
        }
      ]
    },
    atomicMode: {
      selected: 'ALL',
      values: [
        {
          value: 'ALL',
          label: i18n.t('All')
        },
        {
          value: 'NONE',
          label: i18n.t('None')
        }
      ]
    },
    mergeMode: {
      selected: 'MERGE',
      values: [
        {
          value: 'MERGE',
          label: i18n.t('Merge')
        },
        {
          value: 'REPLACE',
          label: i18n.t('Replace')
        }
      ]
    },
    flushMode: {
      selected: 'AUTO',
      values: [
        {
          value: 'AUTO',
          label: i18n.t('Auto')
        },
        {
          value: 'OBJECT',
          label: i18n.t('Object')
        }
      ]
    },
    skipSharing: {
      selected: 'false',
      values: [
        {
          value: 'false',
          label: i18n.t('No')
        },
        {
          value: 'true',
          label: i18n.t('Yes')
        }
      ]
    },
    skipValidation: {
      selected: 'false',
      values: [
        {
          value: 'false',
          label: i18n.t('No')
        },
        {
          value: 'true',
          label: i18n.t('Yes')
        }
      ]
    },
    async: {
      selected: 'false',
      values: [
        {
          value: 'false',
          label: i18n.t('No')
        },
        {
          value: 'true',
          label: i18n.t('Yes')
        }
      ]
    },
    inclusionStrategy: {
      selected: 'NON_NULL',
      values: [
        {
          value: 'NON_NULL',
          label: i18n.t('Non Null')
        },
        {
          value: 'ALWAYS',
          label: i18n.t('Always')
        },
        {
          value: 'NON_EMPTY',
          label: i18n.t('Non Empty')
        }
      ]
    }
  }

  async componentDidMount() {
    await this.fetchLog(0)
  }

  fetchLog = async pageNumber => {
    try {
      let url = 'metadataAudits'
      if (pageNumber) {
        url += `?page=${pageNumber}`
      }
      const {
        data: { pager, metadataAudits }
      } = await api.get(url)

      if (metadataAudits.length > 0) {
        for (let i = metadataAudits.length - 1; i >= 0; i -= 1) {
          const {
            createdAt,
            createdBy,
            klass,
            type,
            uid,
            value
          } = metadataAudits[i]
          const jsonOfValue = JSON.parse(value)

          const mutations = []
          for (const m of jsonOfValue['mutations']) {
            if (m.operation === 'ADDITION') {
              mutations.push(operationAddition(m))
            } else if (m.operation === 'DELETION') {
              mutations.push(operationDeletion(m))
            } else {
              console.warn('MISSING OPERATION', m.operation)
            }
          }

          eventEmitter.emit('log', {
            id: uid,
            d: new Date(createdAt),
            subject: 'MetaData Import',
            text: `Created By: ${createdBy}
Klass: ${klass}
Type: ${type}
UID: ${uid}

Mutations:
${mutations.join('\n')}`
          })
        }
        eventEmitter.emit('log.open')

        if (pager.page < pager.pageCount) {
          await this.fetchLog(pageNumber + 1)
        }
      }
    } catch (e) {
      console.log('Error fetching METADATA_IMPORT')
    }
  }

  onFormUpdate = (name, value) => {
    if (name === 'importFormat') {
      const { _context } = this.state

      if (value === 'csv' && _context !== CTX_CSV_OPTION) {
        this.changeContext(CTX_CSV_OPTION)
      } else {
        this.changeContext(CTX_DEFAULT)
      }
    }
  }

  onSubmit = async () => {
    try {
      const {
        upload,
        importMode,
        identifier,
        importReportMode,
        preheatMode,
        importStrategy,
        atomicMode,
        mergeMode,
        flushMode,
        skipSharing,
        skipValidation,
        async,
        inclusionStrategy
      } = this.getFormState()

      const formData = new FormData()
      formData.set('upload', upload)

      let contentType = null
      if (upload.name.endsWith('.json')) {
        contentType = 'application/json'
      } else if (upload.name.endsWith('.xml')) {
        contentType = 'text/xml'
      }

      const params = []
      params.push(`importMode=${encodeURI(importMode)}`)
      params.push(`identifier=${encodeURI(identifier)}`)
      params.push(`importReportMode=${encodeURI(importReportMode)}`)
      params.push(`preheatMode=${encodeURI(preheatMode)}`)
      params.push(`importStrategy=${encodeURI(importStrategy)}`)
      params.push(`atomicMode=${encodeURI(atomicMode)}`)
      params.push(`mergeMode=${encodeURI(mergeMode)}`)
      params.push(`flushMode=${encodeURI(flushMode)}`)
      params.push(`skipSharing=${encodeURI(skipSharing)}`)
      params.push(`skipValidation=${encodeURI(skipValidation)}`)
      params.push(`async=${encodeURI(async)}`)
      params.push(`inclusionStrategy=${encodeURI(inclusionStrategy)}`)
      // params.push(`userOverrideMode=NONE`)
      // params.push(`overrideUser=`)

      eventEmitter.emit('log', {
        id: new Date().getTime(),
        d: new Date(),
        subject: 'MetaData Import',
        text: `Content-Type: ${contentType}
Import mode: ${importMode}
Identifier: ${identifier}
Import report mode: ${importReportMode}
Preheat mode: ${preheatMode}
Import strategy: ${importStrategy}
Atomic mode: ${atomicMode}
Merge mode: ${mergeMode}
Flush mode: ${flushMode}
Skip sharing: ${skipSharing}
Skip validation: ${skipValidation}
Async: ${async}
Inclusion strategy: ${inclusionStrategy}`
      })
      eventEmitter.emit('log.open')
      this.setState({ processing: true })

      const xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open(
        'POST',
        `${apiConfig.server}/api/metadata?${params.join('&')}`,
        true
      )
      xhr.setRequestHeader('Content-Type', contentType)
      xhr.setRequestHeader(
        'Content-Disposition',
        'attachment filename="' + upload.name + '"'
      )
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4 && Math.floor(xhr.status / 100) === 2) {
          this.setState({ processing: false })
          await this.fetchLog(0)
        }
      }
      xhr.send(upload)
    } catch (e) {
      console.log('MetaData Import error', e, '\n')
    } finally {
    }
  }
}
