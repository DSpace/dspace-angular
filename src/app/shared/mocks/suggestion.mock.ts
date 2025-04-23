import { of } from 'rxjs';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { SearchResult } from '../search/models/search-result.model';
import { createPaginatedList } from '../testing/utils.test';

// REST Mock ---------------------------------------------------------------------
// -------------------------------------------------------------------------------

// Items
// -------------------------------------------------------------------------------

const ItemMockPid1: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174001',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174001',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Index nominum et rerum',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

const ItemMockPid2: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174004',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174004',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'UNA NUOVA RILETTURA DELL\u0027 ARISTOTELE DI FRANZ BRENTANO ALLA LUCE DI ALCUNI INEDITI',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

const ItemMockPid3: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174005',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174005',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Sustainable development',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

const ItemMockPid4: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174006',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174006',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Reply to Critics',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

const ItemMockPid5: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174007',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174007',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'PROGETTAZIONE, SINTESI E VALUTAZIONE DELL\u0027ATTIVITA\u0027 ANTIMICOBATTERICA ED ANTIFUNGINA DI NUOVI DERIVATI ETEROCICLICI',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

const ItemMockPid6: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174008',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174008',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Donald Davidson',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

const ItemMockPid7: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174009',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174009',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Missing abstract article',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

export const ItemMockPid8: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174002',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174002',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Egypt, crossroad of translations and literary interweavings (3rd-6th centuries). A reconsideration of earlier Coptic literature',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

export const ItemMockPid9: Item = Object.assign(
  new Item(),
  {
    handle: '10077/21486',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'ITEM4567-e89b-12d3-a456-426614174003',
    uuid: 'ITEM4567-e89b-12d3-a456-426614174003',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Morocco, crossroad of translations and literary interweavings (3rd-6th centuries). A reconsideration of earlier Coptic literature',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

export const ItemMockPid10: Item = Object.assign(
  new Item(),
  {
    handle: '10713/29832',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'P23e4567-e89b-12d3-a456-426614174002',
    uuid: 'P23e4567-e89b-12d3-a456-426614174002',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Tracking Papyrus and Parchment Paths: An Archaeological Atlas of Coptic Literature.\nLiterary Texts in their Geographical Context: Production, Copying, Usage, Dissemination and Storage',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

export const OpenaireMockDspaceObject: SearchResult<DSpaceObject> = Object.assign(
  new SearchResult<DSpaceObject>(),
  {
    handle: '10713/29832',
    lastModified: '2017-04-24T19:44:08.178+0000',
    isArchived: true,
    isDiscoverable: true,
    isWithdrawn: false,
    _links:{
      self: {
        href: 'https://rest.api/rest/api/core/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357',
      },
    },
    id: 'P23e4567-e89b-12d3-a456-426614174002',
    uuid: 'P23e4567-e89b-12d3-a456-426614174002',
    type: 'item',
    metadata: {
      'dc.creator': [
        {
          language: 'en_US',
          value: 'Doe, Jane',
        },
      ],
      'dc.date.accessioned': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.available': [
        {
          language: null,
          value: '1650-06-26T19:58:25Z',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '1650-06-26',
        },
      ],
      'dc.identifier.issn': [
        {
          language: 'en_US',
          value: '123456789',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://dspace7.4science.it/xmlui/handle/10673/6',
        },
      ],
      'dc.description.abstract': [
        {
          language: 'en_US',
          value: 'This is really just a sample abstract. If it was a real abstract it would contain useful information about this test document. Sorry though, nothing useful in this paragraph. You probably shouldn\'t have even bothered to read it!',
        },
      ],
      'dc.description.provenance': [
        {
          language: 'en',
          value: 'Made available in DSpace on 2012-06-26T19:58:25Z (GMT). No. of bitstreams: 2\r\ntest_ppt.ppt: 12707328 bytes, checksum: a353fc7d29b3c558c986f7463a41efd3 (MD5)\r\ntest_ppt.pptx: 12468572 bytes, checksum: 599305edb4ebee329667f2c35b14d1d6 (MD5)',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T09:17:34Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2013-06-13T11:04:16Z (GMT).',
        },
        {
          language: 'en',
          value: 'Restored into DSpace on 2017-04-24T19:44:08Z (GMT).',
        },
      ],
      'dc.language': [
        {
          language: 'en_US',
          value: 'en',
        },
      ],
      'dc.rights': [
        {
          language: 'en_US',
          value: '© Jane Doe',
        },
      ],
      'dc.subject': [
        {
          language: 'en_US',
          value: 'keyword1',
        },
        {
          language: 'en_US',
          value: 'keyword2',
        },
        {
          language: 'en_US',
          value: 'keyword3',
        },
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'Tracking Papyrus and Parchment Paths: An Archaeological Atlas of Coptic Literature.\nLiterary Texts in their Geographical Context: Production, Copying, Usage, Dissemination and Storage',
        },
      ],
      'dc.type': [
        {
          language: 'en_US',
          value: 'text',
        },
      ],
    },
  },
);

// Classes
// -------------------------------------------------------------------------------

/**
 * Mock for [[SuggestionNotificationsStateService]]
 */
export function getMockSuggestionNotificationsStateService(): any {
  return jasmine.createSpyObj('SuggestionNotificationsStateService', {
    getOpenaireBrokerTopics: jasmine.createSpy('getOpenaireBrokerTopics'),
    isOpenaireBrokerTopicsLoading: jasmine.createSpy('isOpenaireBrokerTopicsLoading'),
    isOpenaireBrokerTopicsLoaded: jasmine.createSpy('isOpenaireBrokerTopicsLoaded'),
    isOpenaireBrokerTopicsProcessing: jasmine.createSpy('isOpenaireBrokerTopicsProcessing'),
    getOpenaireBrokerTopicsTotalPages: jasmine.createSpy('getOpenaireBrokerTopicsTotalPages'),
    getOpenaireBrokerTopicsCurrentPage: jasmine.createSpy('getOpenaireBrokerTopicsCurrentPage'),
    getOpenaireBrokerTopicsTotals: jasmine.createSpy('getOpenaireBrokerTopicsTotals'),
    dispatchRetrieveOpenaireBrokerTopics: jasmine.createSpy('dispatchRetrieveOpenaireBrokerTopics'),
    dispatchMarkUserSuggestionsAsVisitedAction: jasmine.createSpy('dispatchMarkUserSuggestionsAsVisitedAction'),
    dispatchRefreshUserSuggestionsAction: undefined,
  });
}
/**
 * Mock for [[OpenaireBrokerEventRestService]]
 */
export function getMockSuggestionsService(): any {
  return jasmine.createSpyObj('SuggestionsService', {
    getTargets: jasmine.createSpy('getTargets'),
    getSuggestions: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    clearSuggestionRequests: jasmine.createSpy('clearSuggestionRequests'),
    deleteReviewedSuggestion: jasmine.createSpy('deleteReviewedSuggestion'),
    retrieveCurrentUserSuggestions: jasmine.createSpy('retrieveCurrentUserSuggestions'),
    getTargetUuid: jasmine.createSpy('getTargetUuid'),
    ignoreSuggestion: of(null),
    ignoreSuggestionMultiple: of({ success: 1, fails: 0 }),
    approveAndImportMultiple: of({ success: 1, fails: 0 }),
    approveAndImport: of({ id: '1234' }),
    isCollectionFixed: false,
    translateSuggestionSource: 'testSource',
    translateSuggestionType: 'testType',
  });
}
