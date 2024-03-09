import { of as observableOf } from 'rxjs';

import { QualityAssuranceEventDataService } from '../../core/notifications/qa/events/quality-assurance-event-data.service';
import { QualityAssuranceEventObject } from '../../core/notifications/qa/models/quality-assurance-event.model';
import { QualityAssuranceSourceObject } from '../../core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceTopicObject } from '../../core/notifications/qa/models/quality-assurance-topic.model';
import { QualityAssuranceTopicDataService } from '../../core/notifications/qa/topics/quality-assurance-topic-data.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { ResourceType } from '../../core/shared/resource-type';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../remote-data.utils';
import { SearchResult } from '../search/models/search-result.model';

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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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
          value: 'https://demo.dspace.org/handle/10673/6',
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

export const NotificationsMockDspaceObject: SearchResult<DSpaceObject> = Object.assign(
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
          value: 'https://demo.dspace.org/handle/10673/6',
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

// Sources
// -------------------------------------------------------------------------------

export const qualityAssuranceSourceObjectMorePid: QualityAssuranceSourceObject = {
  type: new ResourceType('qasource'),
  id: 'ENRICH!MORE!PID',
  lastEvent: '2020/10/09 10:11 UTC',
  totalEvents: 33,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qasources/ENRICH!MORE!PID',
    },
  },
};

export const qualityAssuranceSourceObjectMoreAbstract: QualityAssuranceSourceObject = {
  type: new ResourceType('qasource'),
  id: 'ENRICH!MORE!ABSTRACT',
  lastEvent: '2020/09/08 21:14 UTC',
  totalEvents: 5,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qasources/ENRICH!MORE!ABSTRACT',
    },
  },
};

export const qualityAssuranceSourceObjectMissingPid: QualityAssuranceSourceObject = {
  type: new ResourceType('qasource'),
  id: 'ENRICH!MISSING!PID',
  lastEvent: '2020/10/01 07:36 UTC',
  totalEvents: 4,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qasources/ENRICH!MISSING!PID',
    },
  },
};

// Topics
// -------------------------------------------------------------------------------

export const qualityAssuranceTopicObjectMorePid: QualityAssuranceTopicObject = {
  type: new ResourceType('qatopic'),
  id: 'ENRICH!MORE!PID',
  name: 'ENRICH/MORE/PID',
  lastEvent: '2020/10/09 10:11 UTC',
  totalEvents: 33,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qatopics/ENRICH!MORE!PID',
    },
  },
};

export const qualityAssuranceTopicObjectMoreAbstract: QualityAssuranceTopicObject = {
  type: new ResourceType('qatopic'),
  id: 'ENRICH!MORE!ABSTRACT',
  name: 'ENRICH/MORE/ABSTRACT',
  lastEvent: '2020/09/08 21:14 UTC',
  totalEvents: 5,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qatopics/ENRICH!MORE!ABSTRACT',
    },
  },
};

export const qualityAssuranceTopicObjectMissingPid: QualityAssuranceTopicObject = {
  type: new ResourceType('qatopic'),
  id: 'ENRICH!MISSING!PID',
  name: 'ENRICH/MISSING/PID',
  lastEvent: '2020/10/01 07:36 UTC',
  totalEvents: 4,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qatopics/ENRICH!MISSING!PID',
    },
  },
};

export const qualityAssuranceTopicObjectMissingAbstract: QualityAssuranceTopicObject = {
  type: new ResourceType('qatopic'),
  id: 'ENRICH!MISSING!ABSTRACT',
  name: 'ENRICH/MISSING/ABSTRACT',
  lastEvent: '2020/10/08 16:14 UTC',
  totalEvents: 71,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qatopics/ENRICH!MISSING!ABSTRACT',
    },
  },
};

export const qualityAssuranceTopicObjectMissingAcm: QualityAssuranceTopicObject = {
  type: new ResourceType('qatopic'),
  id: 'ENRICH!MISSING!SUBJECT!ACM',
  name: 'ENRICH/MISSING/SUBJECT/ACM',
  lastEvent: '2020/09/21 17:51 UTC',
  totalEvents: 18,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qatopics/ENRICH!MISSING!SUBJECT!ACM',
    },
  },
};

export const qualityAssuranceTopicObjectMissingProject: QualityAssuranceTopicObject = {
  type: new ResourceType('qatopic'),
  id: 'ENRICH!MISSING!PROJECT',
  name: 'ENRICH/MISSING/PROJECT',
  lastEvent: '2020/09/17 10:28 UTC',
  totalEvents: 6,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qatopics/ENRICH!MISSING!PROJECT',
    },
  },
};

// Events
// -------------------------------------------------------------------------------

export const qualityAssuranceEventObjectMissingPid: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  uuid: '123e4567-e89b-12d3-a456-426614174001',
  type: new ResourceType('qaevent'),
  originalId: 'oai:www.openstarts.units.it:10077/21486',
  title: 'Index nominum et rerum',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.18848/1447-9494/cgp/v15i09/45934',
    pidHref: 'https://doi.org/10.18848/1447-9494/cgp/v15i09/45934',
    abstract: null,
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing PID',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174001',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174001/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174001/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid1)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingPid2: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174004',
  uuid: '123e4567-e89b-12d3-a456-426614174004',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21486',
  title: 'UNA NUOVA RILETTURA DELL\u0027 ARISTOTELE DI FRANZ BRENTANO ALLA LUCE DI ALCUNI INEDITI',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'urn',
    value: 'http://thesis2.sba.units.it/store/handle/item/12238',
    pidHref:'http://thesis2.sba.units.it/store/handle/item/12238',
    abstract: null,
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing PID',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174004',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174004/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174004/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid2)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingPid3: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174005',
  uuid: '123e4567-e89b-12d3-a456-426614174005',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/554',
  title: 'Sustainable development',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.4324/9780203408889',
    pidHref: 'https://doi.org/10.4324/9780203408889',
    abstract: null,
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing PID',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174005',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174005/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174005/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid3)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingPid4: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174006',
  uuid: '123e4567-e89b-12d3-a456-426614174006',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/10787',
  title: 'Reply to Critics',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.1080/13698230.2018.1430104',
    pidHref: 'https://doi.org/10.1080/13698230.2018.1430104',
    abstract: null,
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing DOI',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174006',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174006/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174006/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid4)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingPid5: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174007',
  uuid: '123e4567-e89b-12d3-a456-426614174007',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/11339',
  title: 'PROGETTAZIONE, SINTESI E VALUTAZIONE DELL\u0027ATTIVITA\u0027 ANTIMICOBATTERICA ED ANTIFUNGINA DI NUOVI DERIVATI ETEROCICLICI',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'urn',
    value: 'http://thesis2.sba.units.it/store/handle/item/12477',
    pidHref:'http://thesis2.sba.units.it/store/handle/item/12477',
    abstract: null,
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing PID',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174007',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174007/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174007/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid5)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingPid6: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174008',
  uuid: '123e4567-e89b-12d3-a456-426614174008',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/29860',
  title: 'Donald Davidson',
  trust: 0.375,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: 'doi',
    value: '10.1111/j.1475-4975.2004.00098.x',
    pidHref: 'https://doi.org/10.1111/j.1475-4975.2004.00098.x',
    abstract: null,
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing PID',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174008',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174008/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174008/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid6)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingAbstract: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174009',
  uuid: '123e4567-e89b-12d3-a456-426614174009',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21110',
  title: 'Missing abstract article',
  trust: 0.751,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: null,
    value: null,
    pidHref: null,
    abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla scelerisque vestibulum tellus sed lacinia. Aenean vitae sapien a quam congue ultrices. Sed vehicula sollicitudin ligula, vitae lacinia velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla scelerisque vestibulum tellus sed lacinia. Aenean vitae sapien a quam congue ultrices. Sed vehicula sollicitudin ligula, vitae lacinia velit.',
    sourceId: null,
    acronym: null,
    code: null,
    funder: null,
    fundingProgram: null,
    jurisdiction: null,
    title: null,
    reason: 'Missing abstract',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174009',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174009/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174009/related',
    },
  },
  target: observableOf(createSuccessfulRemoteDataObject(ItemMockPid7)),
  related: observableOf(createSuccessfulRemoteDataObject(ItemMockPid10)),
};

export const qualityAssuranceEventObjectMissingProjectFound: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  uuid: '123e4567-e89b-12d3-a456-426614174002',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21838',
  title: 'Egypt, crossroad of translations and literary interweavings (3rd-6th centuries). A reconsideration of earlier Coptic literature',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: null,
    value: null,
    pidHref: null,
    abstract: null,
    sourceId: null,
    acronym: 'PAThs',
    code: '687567',
    funder: 'EC',
    fundingProgram: 'H2020',
    jurisdiction: 'EU',
    reason: 'Project found',
    title: 'Tracking Papyrus and Parchment Paths: An Archaeological Atlas of Coptic Literature.\nLiterary Texts in their Geographical Context: Production, Copying, Usage, Dissemination and Storage',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174002',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174002/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174002/related',
    },
  },
  target: createSuccessfulRemoteDataObject$(ItemMockPid8),
  related: createSuccessfulRemoteDataObject$(ItemMockPid10),
};

export const qualityAssuranceEventObjectMissingProjectNotFound: QualityAssuranceEventObject = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  uuid: '123e4567-e89b-12d3-a456-426614174003',
  type: new ResourceType('qualityAssuranceEvent'),
  originalId: 'oai:www.openstarts.units.it:10077/21838',
  title: 'Morocco, crossroad of translations and literary interweavings (3rd-6th centuries). A reconsideration of earlier Coptic literature',
  trust: 1.0,
  eventDate: '2020/10/09 10:11 UTC',
  status: 'PENDING',
  message: {
    type: null,
    value: null,
    pidHref: null,
    abstract: null,
    sourceId: null,
    acronym: 'PAThs',
    code: '687567B',
    funder: 'EC',
    fundingProgram: 'H2021',
    jurisdiction: 'EU',
    title: 'Tracking Unknown Papyrus and Parchment Paths: An Archaeological Atlas of Coptic Literature.\nLiterary Texts in their Geographical Context: Production, Copying, Usage, Dissemination and Storage',
    reason: 'Project not found',
  },
  _links: {
    self: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174003',
    },
    target: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174003/target',
    },
    related: {
      href: 'https://rest.api/rest/api/integration/qaevents/123e4567-e89b-12d3-a456-426614174003/related',
    },
  },
  target: createSuccessfulRemoteDataObject$(ItemMockPid9),
  related: createNoContentRemoteDataObject$(),
};

// Classes
// -------------------------------------------------------------------------------

/**
 * Mock for [[NotificationsStateService]]
 */
export function getMockNotificationsStateService(): any {
  return jasmine.createSpyObj('NotificationsStateService', {
    getQualityAssuranceTopics: jasmine.createSpy('getQualityAssuranceTopics'),
    isQualityAssuranceTopicsLoading: jasmine.createSpy('isQualityAssuranceTopicsLoading'),
    isQualityAssuranceTopicsLoaded: jasmine.createSpy('isQualityAssuranceTopicsLoaded'),
    isQualityAssuranceTopicsProcessing: jasmine.createSpy('isQualityAssuranceTopicsProcessing'),
    getQualityAssuranceTopicsTotalPages: jasmine.createSpy('getQualityAssuranceTopicsTotalPages'),
    getQualityAssuranceTopicsCurrentPage: jasmine.createSpy('getQualityAssuranceTopicsCurrentPage'),
    getQualityAssuranceTopicsTotals: jasmine.createSpy('getQualityAssuranceTopicsTotals'),
    dispatchRetrieveQualityAssuranceTopics: jasmine.createSpy('dispatchRetrieveQualityAssuranceTopics'),
    getQualityAssuranceSource: jasmine.createSpy('getQualityAssuranceSource'),
    isQualityAssuranceSourceLoading: jasmine.createSpy('isQualityAssuranceSourceLoading'),
    isQualityAssuranceSourceLoaded: jasmine.createSpy('isQualityAssuranceSourceLoaded'),
    isQualityAssuranceSourceProcessing: jasmine.createSpy('isQualityAssuranceSourceProcessing'),
    getQualityAssuranceSourceTotalPages: jasmine.createSpy('getQualityAssuranceSourceTotalPages'),
    getQualityAssuranceSourceCurrentPage: jasmine.createSpy('getQualityAssuranceSourceCurrentPage'),
    getQualityAssuranceSourceTotals: jasmine.createSpy('getQualityAssuranceSourceTotals'),
    dispatchRetrieveQualityAssuranceSource: jasmine.createSpy('dispatchRetrieveQualityAssuranceSource'),
    dispatchMarkUserSuggestionsAsVisitedAction: jasmine.createSpy('dispatchMarkUserSuggestionsAsVisitedAction'),
  });
}

/**
 * Mock for [[QualityAssuranceSourceDataService]]
 */
export function getMockQualityAssuranceSourceRestService(): QualityAssuranceTopicDataService {
  return jasmine.createSpyObj('QualityAssuranceSourceDataService', {
    getSources: jasmine.createSpy('getSources'),
    getSource: jasmine.createSpy('getSource'),
  });
}

/**
 * Mock for [[QualityAssuranceTopicDataService]]
 */
export function getMockQualityAssuranceTopicRestService(): QualityAssuranceTopicDataService {
  return jasmine.createSpyObj('QualityAssuranceTopicDataService', {
    getTopic: jasmine.createSpy('getTopic'),
    searchTopicsByTarget: jasmine.createSpy('searchTopicsByTarget'),
    searchTopicsBySource: jasmine.createSpy('searchTopicsBySource'),
    clearFindAllTopicsRequests: jasmine.createSpy('clearFindAllTopicsRequests'),
  });
}

/**
 * Mock for [[QualityAssuranceEventDataService]]
 */
export function getMockQualityAssuranceEventRestService(): QualityAssuranceEventDataService {
  return jasmine.createSpyObj('QualityAssuranceEventDataService', {
    getEventsByTopic: jasmine.createSpy('getEventsByTopic'),
    getEvent: jasmine.createSpy('getEvent'),
    patchEvent: jasmine.createSpy('patchEvent'),
    boundProject: jasmine.createSpy('boundProject'),
    removeProject: jasmine.createSpy('removeProject'),
    clearFindByTopicRequests: jasmine.createSpy('.clearFindByTopicRequests'),
  });
}

/**
 * Mock for [[QualityAssuranceEventDataService]]
 */
export function getMockSuggestionsService(): any {
  return jasmine.createSpyObj('SuggestionsService', {
    getTargets: jasmine.createSpy('getTargets'),
    getSuggestions: jasmine.createSpy('getSuggestions'),
    clearSuggestionRequests: jasmine.createSpy('clearSuggestionRequests'),
    deleteReviewedSuggestion: jasmine.createSpy('deleteReviewedSuggestion'),
    retrieveCurrentUserSuggestions: jasmine.createSpy('retrieveCurrentUserSuggestions'),
    getTargetUuid: jasmine.createSpy('getTargetUuid'),
  });
}
