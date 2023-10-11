import { MetadataValue } from '../../core/shared/metadata.models';
import { Bitstream } from '../../core/shared/bitstream.model';

export const attachmentWithUnspecified = Object.assign(new Bitstream(), {
  id: 'bitstream1',
  uuid: 'bitstream1',
  bundle: undefined,
  bundleName: 'ORIGINAL',
  format: undefined,
  sizeBytes: 130423,
  thumbnail: undefined,
  type: 'bitstream',
  metadata: {
    'dc.description': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'Unspecified description'
      } as MetadataValue
    ],
    'dc.title': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'test-unspecified.pdf'
      } as MetadataValue
    ],
    'dc.type': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'Unspecified'
      } as MetadataValue
    ],
  },
  _links: {
    'content': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/content'
    },
    'bundle': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/bundle'
    },
    'format': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/format'
    },
    'thumbnail': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/thumbnail'
    },
    'self': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7'
    }
  }
});

export const attachmentMainArticle = Object.assign(new Bitstream(), {
  id: 'bitstream2',
  uuid: 'bitstream2',
  bundle: undefined,
  bundleName: 'ORIGINAL',
  format: undefined,
  sizeBytes: 130423,
  thumbnail: undefined,
  type: 'bitstream',
  metadata: {
    'dc.description': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'Main article description'
      } as MetadataValue
    ],
    'dc.title': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'main.pdf'
      } as MetadataValue
    ],
    'dc.type': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'Main Article'
      } as MetadataValue
    ],
  },
  _links: {
    'content': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/content'
    },
    'bundle': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/bundle'
    },
    'format': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/format'
    },
    'thumbnail': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/thumbnail'
    },
    'self': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7'
    }
  }
});


export const attachmentRegex = Object.assign(new Bitstream(), {
  id: 'bitstream3',
  uuid: 'bitstream3',
  bundle: undefined,
  bundleName: 'ORIGINAL',
  format: undefined,
  sizeBytes: 130423,
  thumbnail: undefined,
  type: 'bitstream',
  metadata: {
    'dc.description': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'Main article regex description'
      } as MetadataValue
    ],
    'dc.title': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'main-regex.pdf'
      } as MetadataValue
    ],
    'dc.type': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        value: 'Test Article'
      } as MetadataValue
    ],
  },
  _links: {
    'content': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/content'
    },
    'bundle': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/bundle'
    },
    'format': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/format'
    },
    'thumbnail': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7/thumbnail'
    },
    'self': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/c3eaeb39-aa76-4cb7-ab35-b2f2fa8db2a7'
    }
  }
});

export const attachmentsMock = [attachmentWithUnspecified, attachmentMainArticle, attachmentRegex];
