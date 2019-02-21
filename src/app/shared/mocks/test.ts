const rp = {
  name: null,
  groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
  id: 20,
  uuid: 'resource-policy-20',
  self: 'https://dspace7.4science.it/dspace-spring-rest/api/authz/resourcePolicies/20',
  type: 'resourcePolicy',
  _links: {
    self: 'https://dspace7.4science.it/dspace-spring-rest/api/authz/resourcePolicies/20'
  }
};

const rdg = {
  handle: null,
  permanent: true,
  self: 'https://dspace7.4science.it/dspace-spring-rest/api/eperson/groups/11cc35e5-a11d-4b64-b5b9-0052a5d15509',
  id: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
  uuid: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
  type: 'group',
  name: 'Anonymous',
  metadata: [],
  _links: {
    groups: 'https://dspace7.4science.it/dspace-spring-rest/api/eperson/groups/11cc35e5-a11d-4b64-b5b9-0052a5d15509/groups',
    self: 'https://dspace7.4science.it/dspace-spring-rest/api/eperson/groups/11cc35e5-a11d-4b64-b5b9-0052a5d15509'
  },
  groups: {
    pageInfo: {
      elementsPerPage: 0,
      totalElements: 0,
      totalPages: 1,
      currentPage: 1
    },
    page: []
  }
};

const configUploadResponse = {
  accessConditionOptions: [
    {
      name: 'openaccess',
      groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
      hasStartDate: false,
      hasEndDate: false
    },
    {
      name: 'lease',
      groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
      hasStartDate: false,
      hasEndDate: true,
      maxEndDate: '2019-07-12T14:40:06.308+0000'
    },
    {
      name: 'embargo',
      groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
      hasStartDate: true,
      hasEndDate: false,
      maxStartDate: '2022-01-12T14:40:06.308+0000'
    },
    {
      name: 'administrator',
      groupUUID: '0f2773dd-1741-475f-80e7-ccdef153d655',
      hasStartDate: false,
      hasEndDate: false
    }
  ],
  metadata: {
    rows: [
      {
        fields: [
          {
            input: {
              type: 'onebox'
            },
            label: 'Title',
            mandatory: true,
            repeatable: false,
            mandatoryMessage: 'You must enter a main title for this item.',
            hints: 'Enter the name of the file.',
            selectableMetadata: [
              {
                metadata: 'dc.title',
                label: null,
                authority: null,
                closed: null
              }
            ],
            languageCodes: []
          }
        ]
      },
      {
        fields: [
          {
            input: {
              type: 'textarea'
            },
            label: 'Description',
            mandatory: false,
            repeatable: true,
            hints: 'Enter a description for the file',
            selectableMetadata: [
              {
                metadata: 'dc.description',
                label: null,
                authority: null,
                closed: null
              }
            ],
            languageCodes: []
          }
        ]
      }
    ],
    name: 'bitstream-metadata',
    type: 'submissionform',
    _links: {
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/config/submissionforms/bitstream-metadata'
    },
    self: 'https://dspace7.4science.it/dspace-spring-rest/api/config/submissionforms/bitstream-metadata'
  },
  required: false,
  maxSize: 536870912,
  name: 'upload',
  type: 'submissionupload',
  _links: {
    metadata: 'https://dspace7.4science.it/dspace-spring-rest/api/config/submissionuploads/upload/metadata',
    self: 'https://dspace7.4science.it/dspace-spring-rest/api/config/submissionuploads/upload'
  },
  self: 'https://dspace7.4science.it/dspace-spring-rest/api/config/submissionuploads/upload'
};

const ff = [
  {
    uuid: '123456-test-upload',
    metadata: {
      'dc.source': [
        {
          value: '123456-test-upload.jpg',
          language: null,
          authority: null,
          display: '123456-test-upload.jpg',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ],
      'dc.title': [
        {
          value: '123456-test-upload.jpg',
          language: null,
          authority: null,
          display: '123456-test-upload.jpg',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ]
    },
    accessConditions: [],
    format: {
      id: 16,
      shortDescription: 'JPEG',
      description: 'Joint Photographic Experts Group/JPEG File Interchange Format (JFIF)',
      mimetype: 'image/jpeg',
      supportLevel: 0,
      internal: false,
      extensions: null,
      type: 'bitstreamformat'
    },
    sizeBytes: 202999,
    checkSum: {
      checkSumAlgorithm: 'MD5',
      value: '5e0996996863d2623439cbb53052bc72'
    },
    url: 'https://dspace7-demo.atmire.com/api/core/bitstreams/123456-test-upload/content'
  }
];

const mockFileFormData = {
  metadata: {
    'dc.title': [
      {
        value: 'title',
        language: null,
        authority: null,
        display: 'title',
        confidence: -1,
        place: 0,
        otherInformation: null
      }
    ],
    'dc.description': [
      {
        value: 'description',
        language: null,
        authority: null,
        display: 'description',
        confidence: -1,
        place: 0,
        otherInformation: null
      }
    ]
  },
  accessConditions: [
    {
      name: [
        {
          value: 'openaccess',
          language: null,
          authority: null,
          display: 'openaccess',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ],
      groupUUID: [
        {
          value: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
          language: null,
          authority: null,
          display: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ]
    }
    ,
    {
      name: [
        {
          value: 'lease',
          language: null,
          authority: null,
          display: 'lease',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ],
      endDate: [
        {
          value: {
            year: 2019,
            month: 1,
            day: 16
          },
          language: null,
          authority: null,
          display: {
            year: 2019,
            month: 1,
            day: 16
          },
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ],
      groupUUID: [
        {
          value: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
          language: null,
          authority: null,
          display: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ]
    }
  ]
};
