import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { Group } from '../../core/eperson/models/group.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { SubmissionObjectState } from '../../submission/objects/submission-objects.reducer';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';

export const mockSectionsData = {
  traditionalpageone: {
    'dc.title': [
      new FormFieldMetadataValueObject('test', null, null, 'test')
    ]
  },
  license: {
    url: null,
    acceptanceDate: null,
    granted: false
  },
  upload: {
    files: []
  }
};

export const mockSectionsDataTwo = {
  traditionalpageone: {
    'dc.title': [
      new FormFieldMetadataValueObject('test', null, null, 'test')
    ]
  },
  traditionalpagetwo: {
    'dc.relation': [
      new FormFieldMetadataValueObject('test', null, null, 'test')
    ]
  },
  license: {
    url: null,
    acceptanceDate: null,
    granted: false
  },
  upload: {
    files: []
  }
};

export const mockSectionsErrors = [
  {
    message: 'error.validation.required',
    paths: [
      '/sections/traditionalpageone/dc.contributor.author',
      '/sections/traditionalpageone/dc.title',
      '/sections/traditionalpageone/dc.date.issued'
    ]
  },
  {
    message: 'error.validation.license.notgranted',
    paths: [
      '/sections/license'
    ]
  }
];

export const mockUploadResponse1Errors = {
  errors: [
    {
      message: 'error.validation.required',
      paths: [
        '/sections/traditionalpageone/dc.title',
        '/sections/traditionalpageone/dc.date.issued'
      ]
    }
  ]
};

export const mockUploadResponse1ParsedErrors: any = {
  traditionalpageone: [
    { path: '/sections/traditionalpageone/dc.title', message: 'error.validation.required' },
    { path: '/sections/traditionalpageone/dc.date.issued', message: 'error.validation.required' }
  ]
};

export const mockLicenseParsedErrors: any = {
  license: [
    { path: '/sections/license', message: 'error.validation.license.notgranted' }
  ]
};

export const mockUploadResponse2Errors = {
  errors: [
    {
      message: 'error.validation.required',
      paths: [
        '/sections/traditionalpageone/dc.title',
        '/sections/traditionalpageone/dc.date.issued'
      ]
    },
    {
      message: 'error.upload',
      paths: [
        '/sections/upload'
      ]
    }
  ]
};

export const mockUploadResponse2ParsedErrors = {
  traditionalpageone: [
    { path: '/sections/traditionalpageone/dc.title', message: 'error.validation.required' },
    { path: '/sections/traditionalpageone/dc.date.issued', message: 'error.validation.required' }
  ],
  upload: [
    { path: '/sections/upload', message: 'error.upload' }
  ]
};

export const mockSubmissionRestResponse = [
  {
    id: 826,
    lastModified: '2018-08-03T12:49:45.268+0000',
    collection: [
      {
        handle: '10673/2',
        license: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/license',
        defaultAccessConditions: [],
        logo: [
          {
            sizeBytes: 7451,
            content: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content',
            format: [],
            bundleName: null,
            id: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
            uuid: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
            type: 'bitstream',
            name: null,
            metadata: [],
            _links: {
              content: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content' },
              format: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format' },
              self: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425' }
            }
          }
        ],
        id: '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
        uuid: '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
        type: 'collection',
        name: 'Collection of Sample Items',
        metadata: [
          {
            key: 'dc.provenance',
            language: null,
            value: 'This field is for private provenance information. It is only visible to Administrative users and is not displayed in the user interface by default.'
          },
          {
            key: 'dc.rights.license',
            language: null,
            value: ''
          },
          {
            key: 'dc.description',
            language: null,
            value: '<p>This is a <em>DSpace Collection</em> which contains sample DSpace Items.</p>\r\n<p><strong>Collections in DSpace may only contain Items.</strong></p>\r\n<p>This particular Collection has its own logo (the <a href=\'http://www.opensource.org/\'>Open Source Initiative</a> logo).</p>\r\n<p>This introductory text is editable by System Administrators, Community Administrators (of a parent Community) or Collection Administrators (of this Collection).</p>'
          },
          {
            key: 'dc.description.abstract',
            language: null,
            value: 'This collection contains sample items.'
          },
          {
            key: 'dc.description.tableofcontents',
            language: null,
            value: '<p>This is the <strong>news</strong> section for this Collection. System Administrators, Community Administrators (of a parent Community) or Collection Administrators (of this Collection) can edit this News field.</p>'
          },
          {
            key: 'dc.rights',
            language: null,
            value: '<p><em>If this collection had a specific copyright statement, it would be placed here.</em></p>'
          },
          {
            key: 'dc.title',
            language: null,
            value: 'Collection of Sample Items'
          }
        ],
        _links: {
          license: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/license' },
          defaultAccessConditions: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultAccessConditions' },
          logo: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/logo' },
          self: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb' }
        }
      }
    ],
    item: [
      {
        handle: null,
        lastModified: '2018-07-25T14:08:28.750+0000',
        isArchived: false,
        isDiscoverable: true,
        isWithdrawn: false,
        bitstreams: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/bitstreams',
        id: '6f344222-6980-4738-8192-b808d79af8a5',
        uuid: '6f344222-6980-4738-8192-b808d79af8a5',
        type: 'item',
        name: null,
        metadata: [],
        _links: {
          bitstreams: { href: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/bitstreams' },
          owningCollection: { href: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/owningCollection' },
          templateItemOf: { href: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/templateItemOf' },
          self: { href: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5' }
        }
      }
    ],
    sections: {},
    submissionDefinition: [
      {
        isDefault: true,
        sections: [
          {
            mandatory: true,
            sectionType: 'utils',
            visibility: {
              main: 'HIDDEN',
              other: 'HIDDEN'
            },
            type: 'submissionsection',
            _links: {
              self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction' },
              config: ''
            },
          },
          {
            mandatory: true,
            sectionType: 'collection',
            visibility: {
              main: 'HIDDEN',
              other: 'HIDDEN'
            },
            type: 'submissionsection',
            _links: {
              self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection' },
              config: ''
            },
          },
          {
            header: 'submit.progressbar.describe.stepone',
            mandatory: true,
            sectionType: 'submission-form',
            type: 'submissionsection',
            _links: {
              self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone' },
              config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone' }
            },
          },
          {
            header: 'submit.progressbar.describe.steptwo',
            mandatory: false,
            sectionType: 'submission-form',
            type: 'submissionsection',
            _links: {
              self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo' },
              config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo' }
            },
          },
          {
            header: 'submit.progressbar.upload',
            mandatory: true,
            sectionType: 'upload',
            type: 'submissionsection',
            _links: {
              self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload' },
              config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload' }
            },
          },
          {
            header: 'submit.progressbar.license',
            mandatory: true,
            sectionType: 'license',
            visibility: {
              main: null,
              other: 'READONLY'
            },
            type: 'submissionsection',
            _links: {
              self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license' },
              config: ''
            },
          },
          {
            header : 'submit.progressbar.detect-duplicate',
            mandatory : true,
            sectionType : 'detect-duplicate',
            type : 'submissionsection',
            _links : {
              self : { href: 'https://dspacecris7.4science.cloud/server/api/config/submissionsections/detect-duplicate' },
              config: ''
            }
          }
        ],
        name: 'traditional',
        type: 'submissiondefinition',
        _links: {
          collections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections' },
          sections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections' },
          self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional' }
        },
      }
    ],
    submitter: [],
    errors: [],
    type: 'workspaceitem',
    _links: {
      collection: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/collection' },
      item: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/item' },
      submissionDefinition: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submissionDefinition' },
      submitter: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submitter' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826' }
    }
  }
];

export const mockSubmissionObject = {
  collection: {
    handle: '10673/2',
    license: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/license',
    defaultAccessConditions: {
      pageInfo: {
        elementsPerPage: 1,
        totalElements: 1,
        totalPages: 1,
        currentPage: 1
      },
      page: [
        {
          name: null,
          groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
          id: 20,
          uuid: 'resource-policy-20',
          type: 'resourcePolicy',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/authz/resourcePolicies/20' }
          }
        }
      ]
    },
    logo: {
      sizeBytes: 7451,
      content: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content',
      format: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format',
      bundleName: null,
      id: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      uuid: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      type: 'bitstream',
      name: null,
      metadata: [],
      _links: {
        content: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content' },
        format: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format' },
        self: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425' }
      }
    },
    id: '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
    uuid: '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
    type: 'collection',
    name: 'Collection of Sample Items',
    metadata: [
      {
        key: 'dc.provenance',
        language: null,
        value: 'This field is for private provenance information. It is only visible to Administrative users and is not displayed in the user interface by default.'
      },
      {
        key: 'dc.rights.license',
        language: null,
        value: ''
      },
      {
        key: 'dc.description',
        language: null,
        value: '<p>This is a <em>DSpace Collection</em> which contains sample DSpace Items.</p>\r\n<p><strong>Collections in DSpace may only contain Items.</strong></p>\r\n<p>This particular Collection has its own logo (the <a href=\'http://www.opensource.org/\'>Open Source Initiative</a> logo).</p>\r\n<p>This introductory text is editable by System Administrators, Community Administrators (of a parent Community) or Collection Administrators (of this Collection).</p>'
      },
      {
        key: 'dc.description.abstract',
        language: null,
        value: 'This collection contains sample items.'
      },
      {
        key: 'dc.description.tableofcontents',
        language: null,
        value: '<p>This is the <strong>news</strong> section for this Collection. System Administrators, Community Administrators (of a parent Community) or Collection Administrators (of this Collection) can edit this News field.</p>'
      },
      {
        key: 'dc.rights',
        language: null,
        value: '<p><em>If this collection had a specific copyright statement, it would be placed here.</em></p>'
      },
      {
        key: 'dc.title',
        language: null,
        value: 'Collection of Sample Items'
      }
    ],
    _links: {
      license: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/license' },
      defaultAccessConditions: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultAccessConditions' },
      logo: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/logo' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb' }
    }
  },
  item: {
    handle: null,
    lastModified: '2019-01-09T10:17:33.722+0000',
    isArchived: false,
    isDiscoverable: true,
    isWithdrawn: false,
    owningCollection: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/owningCollection',
    bitstreams: {
      pageInfo: {
        elementsPerPage: 0,
        totalElements: 0,
        totalPages: 1,
        currentPage: 1
      },
      page: []
    },
    id: 'cae8af78-c874-4468-af79-e6c996aa8270',
    uuid: 'cae8af78-c874-4468-af79-e6c996aa8270',
    type: 'item',
    name: null,
    metadata: [],
    _links: {
      bitstreams: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/bitstreams' },
      owningCollection: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/owningCollection' },
      templateItemOf: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/templateItemOf' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270' }
    }
  },
  submissionDefinition: {
    isDefault: true,
    sections: {
      pageInfo: {
        elementsPerPage: 5,
        totalElements: 5,
        totalPages: 1,
        currentPage: 1
      },
      page: [
        {
          mandatory: true,
          sectionType: 'collection',
          visibility: {
            main: 'HIDDEN',
            other: 'HIDDEN'
          },
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection' },
            config: ''
          },
        },
        {
          header: 'submit.progressbar.describe.stepone',
          mandatory: true,
          sectionType: 'submission-form',
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone' },
            config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone' }
          },
        },
        {
          header: 'submit.progressbar.describe.steptwo',
          mandatory: true,
          sectionType: 'submission-form',
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo' },
            config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo' }
          },
        },
        {
          header: 'submit.progressbar.upload',
          mandatory: true,
          sectionType: 'upload',
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload' },
            config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload' }
          },
        },
        {
          header: 'submit.progressbar.license',
          mandatory: true,
          sectionType: 'license',
          visibility: {
            main: null,
            other: 'READONLY'
          },
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license' },
            config: ''
          },
        }
      ]
    },
    name: 'traditional',
    type: 'submissiondefinition',
    _links: {
      collections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections' },
      sections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional' }
    },
    collections: {
      pageInfo: {
        elementsPerPage: 0,
        totalElements: 0,
        totalPages: 1,
        currentPage: 1
      },
      page: []
    }
  },
  submitter: {
    handle: null,
    groups: [],
    netid: null,
    lastActive: '2019-01-09T10:17:33.047+0000',
    canLogIn: true,
    email: 'dspacedemo+submit@gmail.com',
    requireCertificate: false,
    selfRegistered: false,
    id: '99423c27-b642-5tg6-a9cd-6d910e68dca5',
    uuid: '99423c27-b642-5tg6-a9cd-6d910e68dca5',
    type: 'eperson',
    name: 'dspacedemo+submit@gmail.com',
    metadata: [
      {
        key: 'eperson.firstname',
        language: null,
        value: 'Demo'
      },
      {
        key: 'eperson.lastname',
        language: null,
        value: 'Submitter'
      }
    ],
    _links: {
      self: { href: 'https://rest.api/dspace-spring-rest/api/eperson/epersons/99423c27-b642-5tg6-a9cd-6d910e68dca5' }
    }
  },
  id: 826,
  lastModified: '2019-01-09T10:17:33.738+0000',
  sections: {
    'license': {
      url: null,
      acceptanceDate: null,
      granted: false
    },
    'upload': {
      files: []
    },
    'detect-duplicate': {
      matches: {}
    }
  },
  errors: [
    {
      message: 'error.validation.required',
      paths: [
        '/sections/traditionalpageone/dc.title',
        '/sections/traditionalpageone/dc.date.issued'
      ]
    }
  ],
  type: 'workspaceitem',
  _links: {
    collection: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/collection' },
    item: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/item' },
    submissionDefinition: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submissionDefinition' },
    submitter: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submitter' },
    self: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826' }
  }
};

export const mockSubmissionObjectNew = {
  collection: {
    handle: '10673/2',
    license: 'https://rest.api/dspace-spring-rest/api/core/collections/45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb/license',
    defaultAccessConditions: {
      pageInfo: {
        elementsPerPage: 1,
        totalElements: 1,
        totalPages: 1,
        currentPage: 1
      },
      page: [
        {
          name: null,
          groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
          id: 20,
          uuid: 'resource-policy-20',
          type: 'resourcePolicy',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/authz/resourcePolicies/20' }
          }
        }
      ]
    },
    logo: {
      sizeBytes: 7451,
      content: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content',
      format: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format',
      bundleName: null,
      id: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      uuid: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      type: 'bitstream',
      name: null,
      metadata: [],
      _links: {
        content: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content' },
        format: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format' },
        self: { href: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425' }
      }
    },
    id: '45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb',
    uuid: '45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb',
    type: 'collection',
    name: 'Another Collection of Sample Items',
    metadata: [
      {
        key: 'dc.provenance',
        language: null,
        value: 'This field is for private provenance information. It is only visible to Administrative users and is not displayed in the user interface by default.'
      },
      {
        key: 'dc.rights.license',
        language: null,
        value: ''
      },
      {
        key: 'dc.description',
        language: null,
        value: '<p>This is a <em>DSpace Collection</em> which contains sample DSpace Items.</p>\r\n<p><strong>Collections in DSpace may only contain Items.</strong></p>\r\n<p>This particular Collection has its own logo (the <a href=\'http://www.opensource.org/\'>Open Source Initiative</a> logo).</p>\r\n<p>This introductory text is editable by System Administrators, Community Administrators (of a parent Community) or Collection Administrators (of this Collection).</p>'
      },
      {
        key: 'dc.description.abstract',
        language: null,
        value: 'This collection contains sample items.'
      },
      {
        key: 'dc.description.tableofcontents',
        language: null,
        value: '<p>This is the <strong>news</strong> section for this Collection. System Administrators, Community Administrators (of a parent Community) or Collection Administrators (of this Collection) can edit this News field.</p>'
      },
      {
        key: 'dc.rights',
        language: null,
        value: '<p><em>If this collection had a specific copyright statement, it would be placed here.</em></p>'
      },
      {
        key: 'dc.title',
        language: null,
        value: 'Collection of Sample Items'
      }
    ],
    _links: {
      license: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb/license' },
      defaultAccessConditions: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultAccessConditions' },
      logo: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb/logo' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/core/collections/45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb' }
    }
  },
  item: {
    handle: null,
    lastModified: '2019-01-09T10:17:33.722+0000',
    isArchived: false,
    isDiscoverable: true,
    isWithdrawn: false,
    owningCollection: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/owningCollection',
    bitstreams: {
      pageInfo: {
        elementsPerPage: 0,
        totalElements: 0,
        totalPages: 1,
        currentPage: 1
      },
      page: []
    },
    id: 'cae8af78-c874-4468-af79-e6c996aa8270',
    uuid: 'cae8af78-c874-4468-af79-e6c996aa8270',
    type: 'item',
    name: null,
    metadata: [],
    _links: {
      bitstreams: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/bitstreams' },
      owningCollection: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/owningCollection' },
      templateItemOf: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/templateItemOf' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270' }
    }
  },
  submissionDefinition: {
    isDefault: true,
    sections: {
      pageInfo: {
        elementsPerPage: 5,
        totalElements: 5,
        totalPages: 1,
        currentPage: 1
      },
      page: [
        {
          mandatory: true,
          sectionType: 'collection',
          visibility: {
            main: 'HIDDEN',
            other: 'HIDDEN'
          },
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection' },
            config: ''
          },
        },
        {
          header: 'submit.progressbar.describe.stepone',
          mandatory: true,
          sectionType: 'submission-form',
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone' },
            config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone' }
          },
        },
        {
          header: 'submit.progressbar.describe.steptwo',
          mandatory: true,
          sectionType: 'submission-form',
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo' },
            config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo' }
          },
        },
        {
          header: 'submit.progressbar.upload',
          mandatory: true,
          sectionType: 'upload',
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload' },
            config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload' }
          },
        },
        {
          header: 'submit.progressbar.license',
          mandatory: true,
          sectionType: 'license',
          visibility: {
            main: null,
            other: 'READONLY'
          },
          type: 'submissionsection',
          _links: {
            self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license' },
            config: ''
          },
        }
      ]
    },
    name: 'traditionaltwo',
    type: 'submissiondefinition',
    _links: {
      collections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections' },
      sections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections' },
      self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional' }
    },
    collections: {
      pageInfo: {
        elementsPerPage: 0,
        totalElements: 0,
        totalPages: 1,
        currentPage: 1
      },
      page: []
    }
  },
  submitter: {
    handle: null,
    groups: [],
    netid: null,
    lastActive: '2019-01-09T10:17:33.047+0000',
    canLogIn: true,
    email: 'dspacedemo+submit@gmail.com',
    requireCertificate: false,
    selfRegistered: false,
    id: '99423c27-b642-4bb9-a9cd-45gh23e68dca5',
    uuid: '99423c27-b642-4bb9-a9cd-45gh23e68dca5',
    type: 'eperson',
    name: 'dspacedemo+submit@gmail.com',
    metadata: [
      {
        key: 'eperson.firstname',
        language: null,
        value: 'Demo'
      },
      {
        key: 'eperson.lastname',
        language: null,
        value: 'Submitter'
      }
    ],
    _links: {
      self: { href: 'https://rest.api/dspace-spring-rest/api/eperson/epersons/99423c27-b642-4bb9-a9cd-45gh23e68dca5' }
    }
  },
  id: 826,
  lastModified: '2019-01-09T10:17:33.738+0000',
  sections: {},
  errors: [],
  type: 'workspaceitem',
  _links: {
    collection: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/collection' },
    item: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/item' },
    submissionDefinition: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submissionDefinition' },
    submitter: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submitter' },
    self: { href: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826' }
  }
};

export const mockSubmissionCollectionId = '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb';

export const mockSubmissionId = '826';

export const mockSubmissionSelfUrl = 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826';

export const mockSubmissionDefinitionResponse = {
  isDefault: true,
  sections: [
    {
      mandatory: true,
      sectionType: 'utils',
      visibility: {
        main: 'HIDDEN',
        other: 'HIDDEN'
      },
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction' },
        config: ''
      },
    },
    {
      mandatory: true,
      sectionType: 'collection',
      visibility: {
        main: 'HIDDEN',
        other: 'HIDDEN'
      },
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection' },
        config: ''
      },
    },
    {
      header: 'submit.progressbar.describe.stepone',
      mandatory: true,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone' },
        config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone' }
      },
    },
    {
      header: 'submit.progressbar.describe.steptwo',
      mandatory: false,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo' },
        config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo' }
      },
    },
    {
      header: 'submit.progressbar.upload',
      mandatory: true,
      sectionType: 'upload',
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload' },
        config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload' }
      },
    },
    {
      header: 'submit.progressbar.license',
      mandatory: true,
      sectionType: 'license',
      visibility: {
        main: null,
        other: 'READONLY'
      },
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license' },
        config: ''
      },
    }
  ],
  name: 'traditional',
  type: 'submissiondefinition',
  _links: {
    collections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections' },
    sections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections' },
    self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional' }
  },
} as any;

export const mockSubmissionDefinition: SubmissionDefinitionsModel = {
  isDefault: true,
  sections: new PaginatedList(new PageInfo(), [
    {
      mandatory: true,
      sectionType: 'utils',
      visibility: {
        main: 'HIDDEN',
        other: 'HIDDEN'
      },
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction' },
        config: ''
      },
    },
    {
      mandatory: true,
      sectionType: 'collection',
      visibility: {
        main: 'HIDDEN',
        other: 'HIDDEN'
      },
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection' },
        config: ''
      },
    },
    {
      header: 'submit.progressbar.describe.stepone',
      mandatory: true,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone' },
        config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone' }
      },
    },
    {
      header: 'submit.progressbar.describe.steptwo',
      mandatory: false,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo' },
        config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo' }
      },
    },
    {
      header: 'submit.progressbar.upload',
      mandatory: true,
      sectionType: 'upload',
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload' },
        config: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload' }
      },
    },
    {
      header: 'submit.progressbar.license',
      mandatory: true,
      sectionType: 'license',
      visibility: {
        main: null,
        other: 'READONLY'
      },
      type: 'submissionsection',
      _links: {
        self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license' },
        config: ''
      },
    }
  ]),
  name: 'traditional',
  type: 'submissiondefinition',
  _links: {
    collections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections' },
    sections: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections' },
    self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional' }
  },
} as any;

export const mockSubmissionState: SubmissionObjectState = Object.assign({}, {
  826: {
    collection: mockSubmissionCollectionId,
    definition: 'traditional',
    selfUrl: mockSubmissionSelfUrl,
    activeSection: null,
    sections: {
      'extraction': {
        config: '',
        mandatory: true,
        sectionType: 'utils',
        visibility: {
          main: 'HIDDEN',
          other: 'HIDDEN'
        },
        collapsed: false,
        enabled: true,
        data: {},
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any,
      'collection': {
        config: '',
        mandatory: true,
        sectionType: 'collection',
        visibility: {
          main: 'HIDDEN',
          other: 'HIDDEN'
        },
        collapsed: false,
        enabled: true,
        data: {},
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any,
      'traditionalpageone': {
        header: 'submit.progressbar.describe.stepone',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone',
        mandatory: true,
        sectionType: 'submission-form',
        collapsed: false,
        enabled: true,
        data: {},
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any,
      'traditionalpagetwo': {
        header: 'submit.progressbar.describe.steptwo',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo',
        mandatory: false,
        sectionType: 'submission-form',
        collapsed: false,
        enabled: false,
        data: {},
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any,
      'detect-duplicate': {
        header: 'submit.progressbar.detect-duplicate',
        config: '',
        mandatory: true,
        sectionType: 'detect-duplicate',
        collapsed: false,
        enabled: true,
        data: {
          matches: {}
        },
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any,
      'upload': {
        header: 'submit.progressbar.upload',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
        mandatory: true,
        sectionType: 'upload',
        collapsed: false,
        enabled: true,
        data: {
          files: []
        },
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any,
      'license': {
        header: 'submit.progressbar.license',
        config: '',
        mandatory: true,
        sectionType: 'license',
        visibility: {
          main: null,
          other: 'READONLY'
        },
        collapsed: false,
        enabled: true,
        data: {},
        errors: [],
        isLoading: false,
        isValid: false,
        removePending: false
      } as any
    },
    isLoading: false,
    savePending: false,
    depositPending: false
  }
});

export const mockSectionsState = Object.assign({}, {
  extraction: {
    config: '',
    mandatory: true,
    sectionType: 'utils',
    visibility: {
      main: 'HIDDEN',
      other: 'HIDDEN'
    },
    collapsed: false,
    enabled: true,
    data: {},
    errors: [],
    isLoading: false,
    isValid: false
  } as any,
  collection: {
    config: '',
    mandatory: true,
    sectionType: 'collection',
    visibility: {
      main: 'HIDDEN',
      other: 'HIDDEN'
    },
    collapsed: false,
    enabled: true,
    data: {},
    errors: [],
    isLoading: false,
    isValid: false,
    removePending: false
  } as any,
  traditionalpageone: {
    header: 'submit.progressbar.describe.stepone',
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone',
    mandatory: true,
    sectionType: 'submission-form',
    collapsed: false,
    enabled: true,
    data: {},
    errors: [],
    isLoading: false,
    isValid: false,
    removePending: false
  } as any,
  traditionalpagetwo: {
    header: 'submit.progressbar.describe.steptwo',
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo',
    mandatory: false,
    sectionType: 'submission-form',
    collapsed: false,
    enabled: false,
    data: {},
    errors: [],
    isLoading: false,
    isValid: false,
    removePending: false
  } as any,
  upload: {
    header: 'submit.progressbar.upload',
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
    mandatory: true,
    sectionType: 'upload',
    collapsed: false,
    enabled: true,
    data: {},
    errors: [],
    isLoading: false,
    isValid: false,
    removePending: false
  } as any,
  license: {
    header: 'submit.progressbar.license',
    config: '',
    mandatory: true,
    sectionType: 'license',
    visibility: {
      main: null,
      other: 'READONLY'
    },
    collapsed: false,
    enabled: true,
    data: {},
    errors: [],
    isLoading: false,
    isValid: false,
    removePending: false
  } as any
});

export const mockSectionsList = [
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.describe.stepone',
    id: 'traditionalpageone',
    sectionType: 'submission-form'
  },
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.describe.steptwo',
    id: 'traditionalpagetwo',
    sectionType: 'submission-form'
  },
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.upload',
    id: 'upload',
    sectionType: 'upload'
  },
  {
    config: '',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.license',
    id: 'license',
    sectionType: 'license'
  }
];

export const mockUploadConfigResponse = {
  accessConditionOptions: [
    {
      name: 'openaccess',
      groupUUID: '123456-g',
      hasStartDate: false,
      hasEndDate: false
    },
    {
      name: 'lease',
      groupUUID: '123456-g',
      hasStartDate: false,
      hasEndDate: true,
      maxEndDate: '2019-07-12T14:40:06.308+0000'
    },
    {
      name: 'embargo',
      groupUUID: '123456-g',
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
      self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/bitstream-metadata' }
    },
  },
  required: true,
  maxSize: 536870912,
  name: 'upload',
  type: 'submissionupload',
  _links: {
    metadata: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload/metadata' },
    self: { href: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload' }
  },
};

// Clone the object and change one property
export const mockUploadConfigResponseNotRequired = JSON.parse(JSON.stringify(mockUploadConfigResponse));
mockUploadConfigResponseNotRequired.required = false;

export const mockAccessConditionOptions = [
  {
    name: 'openaccess',
    groupUUID: '123456-g',
    hasStartDate: false,
    hasEndDate: false
  },
  {
    name: 'lease',
    groupUUID: '123456-g',
    hasStartDate: false,
    hasEndDate: true,
    maxEndDate: '2019-07-12T14:40:06.308+0000'
  },
  {
    name: 'embargo',
    groupUUID: '123456-g',
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
];

export const mockGroup = Object.assign(new Group(), {
  handle: null,
  permanent: true,
  id: '123456-g',
  uuid: '123456-g',
  type: 'group',
  name: 'Anonymous',
  metadata: [],
  _links: {
    groups: { href: 'https://rest.api/dspace-spring-rest/api/eperson/groups/123456-g1/groups' },
    self: { href: 'https://rest.api/dspace-spring-rest/api/eperson/groups/123456-g1' }
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
});

export const mockUploadFiles = [
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
    accessConditions: [
      {
        id: 3675,
        name: 'lease',
        rpType: 'TYPE_CUSTOM',
        groupUUID: '123456-g',
        action: 'READ',
        endDate: '2019-01-16',
        type: 'resourcePolicy'
      },
      {
        id: 3676,
        name: 'openaccess',
        rpType: 'TYPE_CUSTOM',
        groupUUID: '123456-g',
        action: 'READ',
        type: 'resourcePolicy'
      }
    ],
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
    url: 'https://test-ui.com/api/core/bitstreams/123456-test-upload/content'
  }
];

export const mockFileFormData = {
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
          value: '123456-g',
          language: null,
          authority: null,
          display: '123456-g',
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
          value: '123456-g',
          language: null,
          authority: null,
          display: '123456-g',
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
          value: 'embargo',
          language: null,
          authority: null,
          display: 'lease',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ],
      startDate: [
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
          value: '123456-g',
          language: null,
          authority: null,
          display: '123456-g',
          confidence: -1,
          place: 0,
          otherInformation: null
        }
      ]
    }
  ]
};

// mockDeduplicationMatches id for Workflow decision
export const mockDeduplicationWorkflowId = '78ca1d06-cce7-4ee9-abda-46440d9b0bb7';
// mockDeduplicationMatches id for Submitter decision
export const mockDeduplicationSubmitterId = 'ebae3c99-f438-4b65-879b-1eea7a9e0324';

export const mockDeduplicationMatches = {
  '78ca1d06-cce7-4ee9-abda-46440d9b0bb7' : {
     submitterDecision: null,
     workflowDecision: 'reject',
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: '78ca1d06-cce7-4ee9-abda-46440d9b0bb7',
       uuid: '78ca1d06-cce7-4ee9-abda-46440d9b0bb7',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Michael',
         language: null,
         authority: 'rp02165',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'ZHANG, Xiaowang',
         language: null,
         authority: 'rp01733',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, Rolf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'VAN BAEL, Marlies',
         language: null,
         authority: 'rp01865',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Patrick',
         language: null,
         authority: 'rp00839',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, Gustaaf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '182400',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '09359648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '15214095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'The diamond nucleation step is critical for the chemical vapor deposition (CVD) of diamond on non-diamond substrates, i.e., for heteroepitaxial as well as polycrystalline growth on non-diamond (foreign) substrates. This process has been studied intensively over the past 20 years. [1-8] In general, diamond CVD growth on foreign substrates requires artificial formation of diamond nucleation sites on the substrate\'s surface. The high surface energy of diamond, [9] usually prevents direct, heterogeneous diamond nucleation from the gas phase, hence diamond growth cannot be initiated without this critical nucleation step. [5,8] As for the subsequently occurring diamond growth, it is assumed that atomic hydrogen is the only essential mediator required for stabilizing the diamond phase. Nonetheless, it was recently suggested that diamond can also grow in bulk, i.e., in a solid state environment, such as the sub-surface of silicon, if carbon atoms are sub-implanted by low energetic beams and transformed into diamond grains. [10,11] In this communication, we show that diffusion based transport of carbon atoms from diamond seeds through an interlayer is yet another mechanism by which diamond nuclei can be formed. This process opens further possibilities for the LPLTgrowth of synthetic diamond on a variety of substrates and gives access to new applications for nanocrystal-line diamonds (NCD), where diamond-like carbon and amorphous carbon are already applicable. [12] Carbon transport and subsequently occurring sp 3 bonded carbon cluster formation originates from dissolving so-called ultra-dispersed nanodia-mond particles (UDDs) of 5-10 nm size, which are readily prepared in form of a monolayer beneath a TiO 2 sol-gel thin film on silicon substrate surfaces. [13] Being able to also initiate diamond nucleation, UDDs have become a commonly used tool for CDV diamond seeding and initiation of CVD growth. [14] UDD seeding does not require additional diamond nucleation since the diamond film can grow epitaxially on the UDD grains during the CVD process, which leads to ultra-thin films (30-50 nm) with full surface coverage. In this work NCD film nucleation and growth were studied using UDD particles that are buried under a sol-gel TiO 2 layer spin-coated on UDD seeded silicon substrates. It was observed that when immersed in a conventional H 2 /CH 4 microwave plasma that is commonly used for CVD diamond growth, a partial dissolution of the UDD grain into the TiO 2 occurs. Subsequent carbon diffusion through the 5-10 nm thick TiO 2 layer leads to growth and transformation of the carbon atoms into sp 3 bonded clusters, i.e., diamond nuclei. This was studied by high-resolution transmission electron microscopy (HRTEM), energy-filtered TEM (EFTEM), and electron energy loss spectroscopy (EELS). In order to elucidate the diamond nucleation process in more detail, different sample preparation methods were used, three of which are depicted schematically in the insets of Figure 1 and Figure 2. The first method (method I), inset in Figure 1a, shows a TiO 2 layer deposited by sol-gel technique on a bare Si substrate. The TiO 2 precursor solution contained UDD particles in the mixture. Due to the very low thickness of the TiO 2 interlayer, the time that is required for carbon-saturation of the layer should be very short when exposed to the H 2 /CH 4 plasma during the microwave plasma enhanced CVD (MW PE CVD) process. [15,16] However, due to a too low UDD concentration used in the TiO 2 precursor solution and problems experienced with the homogenous dispersion of the powder, no homogeneous film was obtained after 60 min of CVD growth. Specifically, it appears that the UDD particles float on top of the precursor material and cluster together. This leads, after the formation of the sol-gel layer, to the creation of areas with no seeds and areas with seeds floating on top, as shown in Figure 1a. Furthermore, Figure 1b indicates that no diamond film growth takes place where no diamond seeds were present prior to the growth process, hence proving the necessity of UDD pre-treatment of the TiO 2 coated Si substrates. If no UDD seeding is used at all (method II), i.e., bare TiO 2 is deposited directly onto the Si substrate as shown schematically in COMMUNICATION www.advmat.de',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'English',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-BLACKWELL',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.subject.other',
         value: 'B-NCD-layer',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.subject.other',
         value: 'PID-control',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.subject.other',
         value: 'temperature regulator',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Mono-Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'journal_article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '673',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.publisher.place',
         value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/pssa.201000291',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: 'WOS:000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.provider.type',
         value: 'Pdf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.eissn',
         value: '1521-4095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.source.type',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jtitle',
         value: 'Advanced Materials',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Open Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'With Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Michael; ZHANG, Xiaowang; Erni, Rolf; WILLIAMS, Oliver; HARDY, An; VAN BAEL, Marlies; WAGNER, Patrick; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, Gustaaf (182400) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-21T16:16:02.300+0000',
       type: 'item'
    }
  },
  'ebae3c99-f438-4b65-879b-1eea7a9e0324': {
     submitterDecision: 'reject',
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: 'ebae3c99-f438-4b65-879b-1eea7a9e0324',
       uuid: 'ebae3c99-f438-4b65-879b-1eea7a9e0324',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Michael',
         language: null,
         authority: 'rp02165',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'ZHANG, Xiaowang',
         language: null,
         authority: 'rp01733',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, Rolf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'VAN BAEL, Marlies',
         language: null,
         authority: 'rp01865',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Patrick',
         language: null,
         authority: 'rp00839',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, Gustaaf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '182400',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '09359648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '15214095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'The diamond nucleation step is critical for the chemical vapor deposition (CVD) of diamond on non-diamond substrates, i.e., for heteroepitaxial as well as polycrystalline growth on non-diamond (foreign) substrates. This process has been studied intensively over the past 20 years. [1-8] In general, diamond CVD growth on foreign substrates requires artificial formation of diamond nucleation sites on the substrate\'s surface. The high surface energy of diamond, [9] usually prevents direct, heterogeneous diamond nucleation from the gas phase, hence diamond growth cannot be initiated without this critical nucleation step. [5,8] As for the subsequently occurring diamond growth, it is assumed that atomic hydrogen is the only essential mediator required for stabilizing the diamond phase. Nonetheless, it was recently suggested that diamond can also grow in bulk, i.e., in a solid state environment, such as the sub-surface of silicon, if carbon atoms are sub-implanted by low energetic beams and transformed into diamond grains. [10,11] In this communication, we show that diffusion based transport of carbon atoms from diamond seeds through an interlayer is yet another mechanism by which diamond nuclei can be formed. This process opens further possibilities for the LPLTgrowth of synthetic diamond on a variety of substrates and gives access to new applications for nanocrystal-line diamonds (NCD), where diamond-like carbon and amorphous carbon are already applicable. [12] Carbon transport and subsequently occurring sp 3 bonded carbon cluster formation originates from dissolving so-called ultra-dispersed nanodia-mond particles (UDDs) of 5-10 nm size, which are readily prepared in form of a monolayer beneath a TiO 2 sol-gel thin film on silicon substrate surfaces. [13] Being able to also initiate diamond nucleation, UDDs have become a commonly used tool for CDV diamond seeding and initiation of CVD growth. [14] UDD seeding does not require additional diamond nucleation since the diamond film can grow epitaxially on the UDD grains during the CVD process, which leads to ultra-thin films (30-50 nm) with full surface coverage. In this work NCD film nucleation and growth were studied using UDD particles that are buried under a sol-gel TiO 2 layer spin-coated on UDD seeded silicon substrates. It was observed that when immersed in a conventional H 2 /CH 4 microwave plasma that is commonly used for CVD diamond growth, a partial dissolution of the UDD grain into the TiO 2 occurs. Subsequent carbon diffusion through the 5-10 nm thick TiO 2 layer leads to growth and transformation of the carbon atoms into sp 3 bonded clusters, i.e., diamond nuclei. This was studied by high-resolution transmission electron microscopy (HRTEM), energy-filtered TEM (EFTEM), and electron energy loss spectroscopy (EELS). In order to elucidate the diamond nucleation process in more detail, different sample preparation methods were used, three of which are depicted schematically in the insets of Figure 1 and Figure 2. The first method (method I), inset in Figure 1a, shows a TiO 2 layer deposited by sol-gel technique on a bare Si substrate. The TiO 2 precursor solution contained UDD particles in the mixture. Due to the very low thickness of the TiO 2 interlayer, the time that is required for carbon-saturation of the layer should be very short when exposed to the H 2 /CH 4 plasma during the microwave plasma enhanced CVD (MW PE CVD) process. [15,16] However, due to a too low UDD concentration used in the TiO 2 precursor solution and problems experienced with the homogenous dispersion of the powder, no homogeneous film was obtained after 60 min of CVD growth. Specifically, it appears that the UDD particles float on top of the precursor material and cluster together. This leads, after the formation of the sol-gel layer, to the creation of areas with no seeds and areas with seeds floating on top, as shown in Figure 1a. Furthermore, Figure 1b indicates that no diamond film growth takes place where no diamond seeds were present prior to the growth process, hence proving the necessity of UDD pre-treatment of the TiO 2 coated Si substrates. If no UDD seeding is used at all (method II), i.e., bare TiO 2 is deposited directly onto the Si substrate as shown schematically in COMMUNICATION www.advmat.de',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'English',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-BLACKWELL',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Di-Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'journal_article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '673',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.publisher.place',
         value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/adma.200802305',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: 'WOS:000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.provider.type',
         value: 'Pdf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.eissn',
         value: '1521-4095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.source.type',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jtitle',
         value: 'Advanced Materials',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Open Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'With Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Michael; ZHANG, Xiaowang; Erni, Rolf; WILLIAMS, Oliver; HARDY, An; VAN BAEL, Marlies; WAGNER, Patrick; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, Gustaaf (182400) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-21T16:19:26.201+0000',
       type: 'item'
    }
  },
  'af7ed53f-a967-4033-8c0b-22ece50712b7': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: 'af7ed53f-a967-4033-8c0b-22ece50712b7',
       uuid: 'af7ed53f-a967-4033-8c0b-22ece50712b7',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Marc',
         language: null,
         authority: 'rp02327',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'Zhang, L',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, R',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Bael, MK',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Pawel',
         language: null,
         authority: 'rp00802',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, G',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '2009',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '0935-9648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'English',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-BLACKWELL',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Tri-Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'Journal/Magazine Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '+',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.publisher.place',
         value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/adma.200802305',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: 'WOS:000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.provider.type',
         value: 'Web of Science',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.source.type',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jtitle',
         value: 'ADVANCED MATERIALS',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Closed Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'No Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Marc; Zhang, L; Erni, R; WILLIAMS, Oliver; HARDY, An; Van Bael, MK; WAGNER, Pawel; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, G (2009) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-21T08:39:38.140+0000',
       type: 'item'
    }
  },
  '27bd0e52-d8c1-4239-98aa-52e1fbe68ab9': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: '27bd0e52-d8c1-4239-98aa-52e1fbe68ab9',
       uuid: '27bd0e52-d8c1-4239-98aa-52e1fbe68ab9',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
       handle: '123456789/28372',
       metadata: [ {
         key: 'dc.date.accessioned',
         value: '2019-11-20T10:54:55Z',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.available',
         value: '2019-11-20T10:54:55Z',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '2019',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.submitted',
         value: '2019-11-20T10:53:16Z',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.uri',
         value: 'http://localhost:8080/handle/123456789/28372',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Tetra-Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.faculty',
         value: '[ERROR] Error fetching faculty info.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Closed Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.validation',
         value: '[ERROR] Error fetching validation info.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'No Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: ' (2019) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.organization',
         value: '[ERROR] Error fetching organization info.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: true,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-20T10:54:55.689+0000',
       type: 'item'
    }
  },
  'd9ac8553-aded-41f4-b7d7-97c48efc523d': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: 'd9ac8553-aded-41f4-b7d7-97c48efc523d',
       uuid: 'd9ac8553-aded-41f4-b7d7-97c48efc523d',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
       handle: '1942/9650',
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Michael',
         language: null,
         authority: 'rp02165',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'Zhang, Liang',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, R.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'VAN BAEL, Marlies',
         language: null,
         authority: 'rp01865',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Patrick',
         language: null,
         authority: 'rp00839',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 600
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, G.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.accessioned',
         value: '2009-05-06T13:23:06Z',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '2009',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.citation',
         value: 'ADVANCED MATERIALS, 21(6). p. 670-+',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '0935-9648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.uri',
         value: 'http://hdl.handle.net/1942/9650',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
         language: 'en',
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'en',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-V C H VERLAG GMBH',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Penta-Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
         language: 'en',
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'Journal Contribution',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '+',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.title',
         value: 'ADVANCED MATERIALS',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.format.pages',
         value: '5',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jcat',
         value: 'A1',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.notes',
         value: '[Daenen, Michael; Williams, Oliver Aneurin; Hardy, An; Van Bael, Marlies Karolien; Wagner, Patrick; Haenen, Ken; Nesladek, Milos] Hasselt Univ, Inst Mat Res, B-3950 Diepenbeek, Belgium. [Nesladek, Milos] Acad Sci Czech Republ VVI, Inst Phys, Prague 182400, Czech Republic. [Williams, Oliver Aneurin; Hardy, An; Van Bael, Marlies Karolien; Haenen, Ken; Nesladek, Milos] IMEC Vzw, Div IMOMEC, B-3950 Diepenbeek, Belgium. [Hardy, An] XIOS Hogesch Limburg, Dept Ind Sci & Technol, B-3590 Diepenbeek, Belgium. [Zhang, Liang; Erni, Rot; Van Tendeloo, Gustaaf] Univ Antwerp, EMAT, B-2020 Antwerp, Belgium.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.type.refereed',
         value: 'Refereed',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.type.specified',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.bibliographicCitation.oldjcat',
         value: 'A1',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/adma.200802305',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: '000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'yes',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhasselt',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: null,
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: null,
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: 'no',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.contributor.uhmissing',
         value: null,
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.faculty',
         value: '[ERROR] Error fetching faculty info.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Closed Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.validation',
         value: '[ERROR] Error fetching validation info.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'No Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Michael; Zhang, Liang; Erni, R.; WILLIAMS, Oliver; HARDY, An; VAN BAEL, Marlies; WAGNER, Patrick; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, G. (2009) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites. In: ADVANCED MATERIALS, 21(6). p. 670-+.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.organization',
         value: '[ERROR] Error fetching organization info.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: true,
       discoverable: true,
       withdrawn: false,
       lastModified: '2011-11-25T08:24:48.952+0000',
       type: 'item'
    }
  },
  '5a4d6c2c-588a-4501-b71f-df56ceaebf79': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: '5a4d6c2c-588a-4501-b71f-df56ceaebf79',
       uuid: '5a4d6c2c-588a-4501-b71f-df56ceaebf79',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.title',
         value: 'Diamond Esa-Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Closed Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'No Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2020-01-28T17:10:12.006+0000',
       type: 'item'
    }
  },
  '8aebdea0-97c6-4576-bda5-4a3f974dd7c5': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: '8aebdea0-97c6-4576-bda5-4a3f974dd7c5',
       uuid: '8aebdea0-97c6-4576-bda5-4a3f974dd7c5',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Michael',
         language: null,
         authority: 'rp02165',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'ZHANG, Xiaowang',
         language: null,
         authority: 'rp01733',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, Rolf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'VAN BAEL, Marlies',
         language: null,
         authority: 'rp01865',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Patrick',
         language: null,
         authority: 'rp00839',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, Gustaaf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '182400',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '09359648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '15214095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'The diamond nucleation step is critical for the chemical vapor deposition (CVD) of diamond on non-diamond substrates, i.e., for heteroepitaxial as well as polycrystalline growth on non-diamond (foreign) substrates. This process has been studied intensively over the past 20 years. [1-8] In general, diamond CVD growth on foreign substrates requires artificial formation of diamond nucleation sites on the substrate\'s surface. The high surface energy of diamond, [9] usually prevents direct, heterogeneous diamond nucleation from the gas phase, hence diamond growth cannot be initiated without this critical nucleation step. [5,8] As for the subsequently occurring diamond growth, it is assumed that atomic hydrogen is the only essential mediator required for stabilizing the diamond phase. Nonetheless, it was recently suggested that diamond can also grow in bulk, i.e., in a solid state environment, such as the sub-surface of silicon, if carbon atoms are sub-implanted by low energetic beams and transformed into diamond grains. [10,11] In this communication, we show that diffusion based transport of carbon atoms from diamond seeds through an interlayer is yet another mechanism by which diamond nuclei can be formed. This process opens further possibilities for the LPLTgrowth of synthetic diamond on a variety of substrates and gives access to new applications for nanocrystal-line diamonds (NCD), where diamond-like carbon and amorphous carbon are already applicable. [12] Carbon transport and subsequently occurring sp 3 bonded carbon cluster formation originates from dissolving so-called ultra-dispersed nanodia-mond particles (UDDs) of 5-10 nm size, which are readily prepared in form of a monolayer beneath a TiO 2 sol-gel thin film on silicon substrate surfaces. [13] Being able to also initiate diamond nucleation, UDDs have become a commonly used tool for CDV diamond seeding and initiation of CVD growth. [14] UDD seeding does not require additional diamond nucleation since the diamond film can grow epitaxially on the UDD grains during the CVD process, which leads to ultra-thin films (30-50 nm) with full surface coverage. In this work NCD film nucleation and growth were studied using UDD particles that are buried under a sol-gel TiO 2 layer spin-coated on UDD seeded silicon substrates. It was observed that when immersed in a conventional H 2 /CH 4 microwave plasma that is commonly used for CVD diamond growth, a partial dissolution of the UDD grain into the TiO 2 occurs. Subsequent carbon diffusion through the 5-10 nm thick TiO 2 layer leads to growth and transformation of the carbon atoms into sp 3 bonded clusters, i.e., diamond nuclei. This was studied by high-resolution transmission electron microscopy (HRTEM), energy-filtered TEM (EFTEM), and electron energy loss spectroscopy (EELS). In order to elucidate the diamond nucleation process in more detail, different sample preparation methods were used, three of which are depicted schematically in the insets of Figure 1 and Figure 2. The first method (method I), inset in Figure 1a, shows a TiO 2 layer deposited by sol-gel technique on a bare Si substrate. The TiO 2 precursor solution contained UDD particles in the mixture. Due to the very low thickness of the TiO 2 interlayer, the time that is required for carbon-saturation of the layer should be very short when exposed to the H 2 /CH 4 plasma during the microwave plasma enhanced CVD (MW PE CVD) process. [15,16] However, due to a too low UDD concentration used in the TiO 2 precursor solution and problems experienced with the homogenous dispersion of the powder, no homogeneous film was obtained after 60 min of CVD growth. Specifically, it appears that the UDD particles float on top of the precursor material and cluster together. This leads, after the formation of the sol-gel layer, to the creation of areas with no seeds and areas with seeds floating on top, as shown in Figure 1a. Furthermore, Figure 1b indicates that no diamond film growth takes place where no diamond seeds were present prior to the growth process, hence proving the necessity of UDD pre-treatment of the TiO 2 coated Si substrates. If no UDD seeding is used at all (method II), i.e., bare TiO 2 is deposited directly onto the Si substrate as shown schematically in COMMUNICATION www.advmat.de',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'English',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-BLACKWELL',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Epta-Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'journal_article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '673',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.publisher.place',
         value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/adma.200802305',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: 'WOS:000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.provider.type',
         value: 'Pdf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.eissn',
         value: '1521-4095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.source.type',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jtitle',
         value: 'Advanced Materials',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Open Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'With Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Michael; ZHANG, Xiaowang; Erni, Rolf; WILLIAMS, Oliver; HARDY, An; VAN BAEL, Marlies; WAGNER, Patrick; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, Gustaaf (182400) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-21T16:19:59.566+0000',
       type: 'item'
    }
  },
  '7d69f4c6-82a9-4c48-8c5a-aded913882fd': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: '7d69f4c6-82a9-4c48-8c5a-aded913882fd',
       uuid: '7d69f4c6-82a9-4c48-8c5a-aded913882fd',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Michael',
         language: null,
         authority: 'rp02165',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'ZHANG, Xiaowang',
         language: null,
         authority: 'rp01733',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, Rolf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'VAN BAEL, Marlies',
         language: null,
         authority: 'rp01865',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Patrick',
         language: null,
         authority: 'rp00839',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, Gustaaf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '182400',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '09359648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '15214095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'The diamond nucleation step is critical for the chemical vapor deposition (CVD) of diamond on non-diamond substrates, i.e., for heteroepitaxial as well as polycrystalline growth on non-diamond (foreign) substrates. This process has been studied intensively over the past 20 years. [1-8] In general, diamond CVD growth on foreign substrates requires artificial formation of diamond nucleation sites on the substrate\'s surface. The high surface energy of diamond, [9] usually prevents direct, heterogeneous diamond nucleation from the gas phase, hence diamond growth cannot be initiated without this critical nucleation step. [5,8] As for the subsequently occurring diamond growth, it is assumed that atomic hydrogen is the only essential mediator required for stabilizing the diamond phase. Nonetheless, it was recently suggested that diamond can also grow in bulk, i.e., in a solid state environment, such as the sub-surface of silicon, if carbon atoms are sub-implanted by low energetic beams and transformed into diamond grains. [10,11] In this communication, we show that diffusion based transport of carbon atoms from diamond seeds through an interlayer is yet another mechanism by which diamond nuclei can be formed. This process opens further possibilities for the LPLTgrowth of synthetic diamond on a variety of substrates and gives access to new applications for nanocrystal-line diamonds (NCD), where diamond-like carbon and amorphous carbon are already applicable. [12] Carbon transport and subsequently occurring sp 3 bonded carbon cluster formation originates from dissolving so-called ultra-dispersed nanodia-mond particles (UDDs) of 5-10 nm size, which are readily prepared in form of a monolayer beneath a TiO 2 sol-gel thin film on silicon substrate surfaces. [13] Being able to also initiate diamond nucleation, UDDs have become a commonly used tool for CDV diamond seeding and initiation of CVD growth. [14] UDD seeding does not require additional diamond nucleation since the diamond film can grow epitaxially on the UDD grains during the CVD process, which leads to ultra-thin films (30-50 nm) with full surface coverage. In this work NCD film nucleation and growth were studied using UDD particles that are buried under a sol-gel TiO 2 layer spin-coated on UDD seeded silicon substrates. It was observed that when immersed in a conventional H 2 /CH 4 microwave plasma that is commonly used for CVD diamond growth, a partial dissolution of the UDD grain into the TiO 2 occurs. Subsequent carbon diffusion through the 5-10 nm thick TiO 2 layer leads to growth and transformation of the carbon atoms into sp 3 bonded clusters, i.e., diamond nuclei. This was studied by high-resolution transmission electron microscopy (HRTEM), energy-filtered TEM (EFTEM), and electron energy loss spectroscopy (EELS). In order to elucidate the diamond nucleation process in more detail, different sample preparation methods were used, three of which are depicted schematically in the insets of Figure 1 and Figure 2. The first method (method I), inset in Figure 1a, shows a TiO 2 layer deposited by sol-gel technique on a bare Si substrate. The TiO 2 precursor solution contained UDD particles in the mixture. Due to the very low thickness of the TiO 2 interlayer, the time that is required for carbon-saturation of the layer should be very short when exposed to the H 2 /CH 4 plasma during the microwave plasma enhanced CVD (MW PE CVD) process. [15,16] However, due to a too low UDD concentration used in the TiO 2 precursor solution and problems experienced with the homogenous dispersion of the powder, no homogeneous film was obtained after 60 min of CVD growth. Specifically, it appears that the UDD particles float on top of the precursor material and cluster together. This leads, after the formation of the sol-gel layer, to the creation of areas with no seeds and areas with seeds floating on top, as shown in Figure 1a. Furthermore, Figure 1b indicates that no diamond film growth takes place where no diamond seeds were present prior to the growth process, hence proving the necessity of UDD pre-treatment of the TiO 2 coated Si substrates. If no UDD seeding is used at all (method II), i.e., bare TiO 2 is deposited directly onto the Si substrate as shown schematically in COMMUNICATION www.advmat.de',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'English',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-BLACKWELL',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.subject.other',
         value: 'B-NCD-layer',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.subject.other',
         value: 'PID-control',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.subject.other',
         value: 'temperature regulator',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Otta-Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'journal_article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '673',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.publisher.place',
         value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/pssa.201000291',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: 'WOS:000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.provider.type',
         value: 'Pdf',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.eissn',
         value: '1521-4095',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.source.type',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jtitle',
         value: 'Advanced Materials',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Open Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'With Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Michael; ZHANG, Xiaowang; Erni, Rolf; WILLIAMS, Oliver; HARDY, An; VAN BAEL, Marlies; WAGNER, Patrick; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, Gustaaf (182400) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-21T16:11:05.541+0000',
       type: 'item'
    }
  },
  '9beaeeab-101c-4ad7-9045-ec72ca58a03b': {
     submitterDecision: null,
     workflowDecision: null,
     adminDecision: null,
     submitterNote: null,
     workflowNote: null,
     matchObject: {
       id: '9beaeeab-101c-4ad7-9045-ec72ca58a03b',
       uuid: '9beaeeab-101c-4ad7-9045-ec72ca58a03b',
       name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
       handle: null,
       metadata: [ {
         key: 'dc.contributor.author',
         value: 'DAENEN, Marc',
         language: null,
         authority: 'rp02327',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'Zhang, L',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'Erni, R',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WILLIAMS, Oliver',
         language: null,
         authority: 'rp01028',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'HARDY, An',
         language: null,
         authority: 'rp02004',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Bael, MK',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.contributor.author',
         value: 'WAGNER, Pawel',
         language: null,
         authority: 'rp00802',
         confidence: 400
      }, {
         key: 'dc.contributor.author',
         value: 'HAENEN, Ken',
         language: null,
         authority: 'rp00770',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'NESLADEK, Milos',
         language: null,
         authority: 'rp00350',
         confidence: 500
      }, {
         key: 'dc.contributor.author',
         value: 'Van Tendeloo, G',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.date.issued',
         value: '2009',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issn',
         value: '0935-9648',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.description.abstract',
         value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.language.iso',
         value: 'English',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.publisher',
         value: 'WILEY-BLACKWELL',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.title',
         value: 'Diamond Ennea-Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.type',
         value: 'Journal/Magazine Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.epage',
         value: '+',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.issue',
         value: '6',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.spage',
         value: '670',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.volume',
         value: '21',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.publisher.place',
         value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.doi',
         value: '10.1002/adma.200802305',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.identifier.isi',
         value: 'WOS:000263492000007',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.provider.type',
         value: 'Web of Science',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'dc.source.type',
         value: 'Article',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'local.bibliographicCitation.jtitle',
         value: 'ADVANCED MATERIALS',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.accessRights',
         value: 'Closed Access',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fulltext',
         value: 'No Fulltext',
         language: null,
         authority: null,
         confidence: -1
      }, {
         key: 'item.fullcitation',
         value: 'DAENEN, Marc; Zhang, L; Erni, R; WILLIAMS, Oliver; HARDY, An; Van Bael, MK; WAGNER, Pawel; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, G (2009) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2 Sol-Gel Composites.',
         language: null,
         authority: null,
         confidence: -1
      } ],
       inArchive: false,
       discoverable: true,
       withdrawn: false,
       lastModified: '2019-11-21T08:50:25.318+0000',
       type: 'item'
    }
  }
}
