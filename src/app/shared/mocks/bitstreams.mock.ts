import { MetadataValue } from '../../core/shared/metadata.models';
import { Bitstream } from '../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

export const mockThumbnail = Object.assign(new Bitstream(), {
  id: 'thumbnail1',
  uuid: 'thumbnail1',
  sizeBytes: 7798,
  metadata: {
    'dc.description': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: 'f7a94983-aaa2-45b4-8fa4-554566734fb5',
        value: 'Generated Thumbnail'
      } as MetadataValue
    ],
    'dc.title': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: '392bb9b3-7de4-41e4-881f-e72b221cfefd',
        value: 'Written by FormatFilter org.dspace.app.mediafilter.JPEGFilter on 2022-05-24T15:12:12Z (GMT).'
      } as MetadataValue
    ],
    'dc.source': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
        value: 'young-waiter-2021-08-26-15-47-22-utc-2-pjv2sebbckijc4ix63skyzmskmq00l3p5d9ms2zvqo.jpg'
      } as MetadataValue
    ],
    'dc.type': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
        value: 'Test'
      } as MetadataValue
    ],
  },
  thumbnail: createSuccessfulRemoteDataObject$(null),
  _links: {
    'content': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/content'
    },
    'bundle': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/bundle'
    },
    'format': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/format'
    },
    'thumbnail': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/thumbnail'
    },
    'self': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b'
    }
  }
});

export const bitstreamWithThumbnail = Object.assign(new Bitstream(), {
    id: 'bitstream2',
    uuid: 'bitstream2',
    thumbnail: createSuccessfulRemoteDataObject$(mockThumbnail),
});

export const bitstreamWithoutThumbnail = Object.assign(new Bitstream(), {
    id: 'bitstream1',
    uuid: 'bitstream1',
    sizeBytes: 7798,
    metadata: {
        'dc.description': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: 'f7a94983-aaa2-45b4-8fa4-554566734fb5',
                value: 'Generated Thumbnail'
            } as MetadataValue
        ],
        'dc.title': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '392bb9b3-7de4-41e4-881f-e72b221cfefd',
                value: 'Written by FormatFilter org.dspace.app.mediafilter.JPEGFilter on 2022-05-24T15:12:12Z (GMT).'
            } as MetadataValue
        ],
        'dc.source': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
                value: 'young-waiter-2021-08-26-15-47-22-utc-2-pjv2sebbckijc4ix63skyzmskmq00l3p5d9ms2zvqo.jpg'
            } as MetadataValue
        ],
        'dc.type': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
                value: 'Test'
            } as MetadataValue
        ],
    },
    thumbnail: createSuccessfulRemoteDataObject$(null),
    _links: {
        'content': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/content'
        },
        'bundle': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/bundle'
        },
        'format': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/format'
        },
        'thumbnail': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/thumbnail'
        },
        'self': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b'
        }
    }

});

export const mockThumbnailWithType = Object.assign(new Bitstream(), {
  id: 'thumbnail1',
  uuid: 'thumbnail1',
  sizeBytes: 7798,
  metadata: {
    'dc.description': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: 'f7a94983-aaa2-45b4-8fa4-554566734fb5',
        value: 'Generated Thumbnail'
      } as MetadataValue
    ],
    'dc.title': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: '392bb9b3-7de4-41e4-881f-e72b221cfefd',
        value: 'Written by FormatFilter org.dspace.app.mediafilter.JPEGFilter on 2022-05-24T15:12:12Z (GMT).'
      } as MetadataValue
    ],
    'dc.source': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
        value: 'young-waiter-2021-08-26-15-47-22-utc-2-pjv2sebbckijc4ix63skyzmskmq00l3p5d9ms2zvqo.jpg'
      } as MetadataValue
    ],
    'dc.type': [
      {
        authority: null,
        confidence: -1,
        language: null,
        place: 0,
        uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
        value: 'Personal Picture'
      } as MetadataValue
    ],
  },
  thumbnail: createSuccessfulRemoteDataObject$(null),
  _links: {
    'content': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/content'
    },
    'bundle': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/bundle'
    },
    'format': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/format'
    },
    'thumbnail': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/thumbnail'
    },
    'self': {
      'href': 'http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b'
    }
  }
});

export const bitstreamWithThumbnailWithMetadata = Object.assign(new Bitstream(), {
    id: 'bitstream2',
    uuid: 'bitstream2',
    metadata: {
        'dc.type': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
                value: 'Personal Picture'
            } as MetadataValue
        ],
    },
    thumbnail: createSuccessfulRemoteDataObject$(mockThumbnailWithType),
});

export const bitstreamOrignialWithMetadata = Object.assign(new Bitstream(), {
    id: 'bitstream1',
    uuid: 'bitstream1',
    sizeBytes: 7798,
    metadata: {
        'dc.description': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: 'f7a94983-aaa2-45b4-8fa4-554566734fb5',
                value: 'Generated Thumbnail'
            } as MetadataValue
        ],
        'dc.title': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '392bb9b3-7de4-41e4-881f-e72b221cfefd',
                value: 'Written by FormatFilter org.dspace.app.mediafilter.JPEGFilter on 2022-05-24T15:12:12Z (GMT).'
            } as MetadataValue
        ],
        'dc.source': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
                value: 'young-waiter-2021-08-26-15-47-22-utc-2-pjv2sebbckijc4ix63skyzmskmq00l3p5d9ms2zvqo.jpg'
            } as MetadataValue
        ],
        'dc.type': [
            {
                authority: null,
                confidence: -1,
                language: null,
                place: 0,
                uuid: '5f1933f7-670c-43f0-beab-f3ea9e753e94',
                value: 'Personal Picture'
            } as MetadataValue
        ],
    },
    thumbnail: createSuccessfulRemoteDataObject$(null),
    _links: {
        'content': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/content'
        },
        'bundle': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/bundle'
        },
        'format': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/format'
        },
        'thumbnail': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/thumbnail'
        },
        'self': {
            'href': 'http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b'
        }
    }

});
