import React from 'react'
import { render } from 'test-utils'
import '@testing-library/jest-dom/extend-expect'

import { MetadataImportIcon } from '../index'

const props = {
    width: 48,
    height: 48,
}

const r = <MetadataImportIcon {...props} />

it('matches snapshot', () => {
    const { asFragment } = render(r)
    expect(asFragment()).toMatchSnapshot()
})

it('shows icon', () => {
    const { getByDataTest } = render(r)
    const icon = getByDataTest('icon-metadataimport')
    expect(icon).toContainHTML('</path>')
})
