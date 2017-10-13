import { NormalizedItem } from '../../core/cache/models/normalized-item.model';

export const MockNormalizedItem: NormalizedItem = Object.assign(new NormalizedItem(), {
  handle: '10673/6',
  lastModified: new Date('2017-04-24T19:44:08.178+0000'),
  isArchived: true,
  isDiscoverable: true,
  isWithdrawn: false,
  bitstreams: [
    'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/a7cd7d97-4e40-41db-80a8-fac908b63bb8',
    'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/9ff3df0d-1709-472f-8c00-d3e8db2153c8',
    'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/d660a4b8-e7cc-45cd-b026-35f98c5bd3ba'
  ],
  self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  id: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  uuid: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  type: 'item',
  name: 'Test PowerPoint Document',
  metadata: [
    {
      key: 'dc.creator',
      language: 'en_US',
      value: 'Doe, Jane L'
    },
    {
      key: 'dc.date.accessioned',
      language: null,
      value: '1650-06-26T19:58:25Z'
    },
    {
      key: 'dc.date.available',
      language: null,
      value: '1650-06-26T19:58:25Z'
    },
    {
      key: 'dc.date.issued',
      language: null,
      value: '1650-06-26'
    },
    {
      key: 'dc.identifier.issn',
      language: 'en_US',
      value: '123456789'
    },
    {
      key: 'dc.identifier.uri',
      language: null,
      value: 'http://dspace7.4science.it/xmlui/handle/10673/6'
    },
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!'
    },
    {
      key: 'dc.description.provenance',
      language: 'en',
      value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)'
    },
    {
      key: 'dc.description.provenance',
      language: 'en',
      value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).'
    },
    {
      key: 'dc.description.provenance',
      language: 'en',
      value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).'
    },
    {
      key: 'dc.description.provenance',
      language: 'en',
      value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).'
    },
    {
      key: 'dc.language',
      language: 'en_US',
      value: 'en'
    },
    {
      key: 'dc.rights',
      language: 'en_US',
      value: '© Jane Doe'
    },
    {
      key: 'dc.subject',
      language: 'en_US',
      value: 'keyword1'
    },
    {
      key: 'dc.subject',
      language: 'en_US',
      value: 'keyword2'
    },
    {
      key: 'dc.subject',
      language: 'en_US',
      value: 'keyword3'
    },
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Test PowerPoint Document'
    },
    {
      key: 'dc.type',
      language: 'en_US',
      value: 'text'
    }
  ],
  owningCollection: [
    'https://dspace7.4science.it/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb'
  ]
})
