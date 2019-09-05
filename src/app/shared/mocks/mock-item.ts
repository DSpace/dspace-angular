import {of as observableOf,  Observable } from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { PaginatedList } from '../../core/data/paginated-list';

/* tslint:disable:no-shadowed-variable */
export const MockItem: Item = Object.assign(new Item(), {
  handle: '10673/6',
  lastModified: '2017-04-24T19:44:08.178+0000',
  isArchived: true,
  isDiscoverable: true,
  isWithdrawn: false,
  bitstreams: observableOf(Object.assign({
    self: 'dspace-angular://aggregated/object/1507836003548',
    requestPending: false,
    responsePending: false,
    isSuccessful: true,
    errorMessage: '',
    state: '',
    error: undefined,
    isRequestPending: false,
    isResponsePending: false,
    isLoading: false,
    hasFailed: false,
    hasSucceeded: true,
    statusCode: '202',
    pageInfo: {},
    payload: {
      pageInfo: {
        elementsPerPage: 20,
        totalElements: 3,
        totalPages: 1,
        currentPage: 2
      },
      page: [
        {
          sizeBytes: 10201,
          content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
          format: observableOf({
            self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/10',
            requestPending: false,
            responsePending: false,
            isSuccessful: true,
            errorMessage: '',
            statusCode: '202',
            pageInfo: {},
            payload: {
              shortDescription: 'Microsoft Word XML',
              description: 'Microsoft Word XML',
              mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              supportLevel: 0,
              internal: false,
              extensions: null,
              self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/10'
            }
          }),
          bundleName: 'ORIGINAL',
          self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713',
          id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
          uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
          type: 'bitstream',
          metadata: {
            'dc.title': [
              {
                language: null,
                value: 'test_word.docx'
              }
            ]
          }
        },
        {
          sizeBytes: 31302,
          content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28/content',
          format: observableOf({
            self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/4',
            requestPending: false,
            responsePending: false,
            isSuccessful: true,
            errorMessage: '',
            statusCode: '202',
            pageInfo: {},
            payload: {
              shortDescription: 'Adobe PDF',
              description: 'Adobe Portable Document Format',
              mimetype: 'application/pdf',
              supportLevel: 0,
              internal: false,
              extensions: null,
              self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreamformats/4'
            }
          }),
          bundleName: 'ORIGINAL',
          self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28',
          id: '99b00f3c-1cc6-4689-8158-91965bee6b28',
          uuid: '99b00f3c-1cc6-4689-8158-91965bee6b28',
          type: 'bitstream',
          metadata: {
            'dc.title': [
              {
                language: null,
                value: 'test_pdf.pdf'
              }
            ]
          }
        }
      ]
    }
  }) as RemoteData<PaginatedList<Bitstream>>),
  self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  id: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  uuid: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  type: 'item',
  metadata: {
    'dc.creator': [
      {
        language: 'en_US',
        value: 'Doe, Jane'
      }
    ],
    'dc.date.accessioned': [
      {
        language: null,
        value: '1650-06-26T19:58:25Z'
      }
    ],
    'dc.date.available': [
      {
        language: null,
        value: '1650-06-26T19:58:25Z'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '1650-06-26'
      }
    ],
    'dc.identifier.issn': [
      {
        language: 'en_US',
        value: '123456789'
      }
    ],
    'dc.identifier.uri': [
      {
        language: null,
        value: 'http://dspace7.4science.it/xmlui/handle/10673/6'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!'
      }
    ],
    'dc.description.provenance': [
      {
        language: 'en',
        value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)'
      },
      {
        language: 'en',
        value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).'
      },
      {
        language: 'en',
        value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).'
      },
      {
        language: 'en',
        value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).'
      }
    ],
    'dc.language': [
      {
        language: 'en_US',
        value: 'en'
      }
    ],
    'dc.rights': [
      {
        language: 'en_US',
        value: '© Jane Doe'
      }
    ],
    'dc.subject': [
      {
        language: 'en_US',
        value: 'keyword1'
      },
      {
        language: 'en_US',
        value: 'keyword2'
      },
      {
        language: 'en_US',
        value: 'keyword3'
      }
    ],
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test PowerPoint Document'
      }
    ],
    'dc.type': [
      {
        language: 'en_US',
        value: 'text'
      }
    ]
  },
  owningCollection: observableOf({
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
      requestPending: false,
      responsePending: false,
      isSuccessful: true,
      errorMessage: '',
      statusCode: '202',
      pageInfo: {},
      payload: []
    }
  )});
/* tslint:enable:no-shadowed-variable */
