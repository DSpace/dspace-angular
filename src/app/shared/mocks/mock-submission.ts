import { SubmissionObjectState } from '../../submission/objects/submission-objects.reducer';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';

export const mockSectionsData = {
  traditionalpageone:{
    'dc.title': [
      new FormFieldMetadataValueObject('test', null, null, 'test' )
    ]},
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
  traditionalpageone:{
    'dc.title': [
      new FormFieldMetadataValueObject('test', null, null, 'test' )
    ]},
  traditionalpagetwo:{
    'dc.relation': [
      new FormFieldMetadataValueObject('test', null, null, 'test' )
    ]},
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

export const submissionRestResponse = [
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
            self: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425',
            id: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
            uuid: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
            type: 'bitstream',
            name: null,
            metadata: [],
            _links: {
              content: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content',
              format: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format',
              self: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425'
            }
          }
        ],
        self: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
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
          license: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/license',
          defaultAccessConditions: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultAccessConditions',
          logo: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/logo',
          self: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb'
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
        self: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5',
        id: '6f344222-6980-4738-8192-b808d79af8a5',
        uuid: '6f344222-6980-4738-8192-b808d79af8a5',
        type: 'item',
        name: null,
        metadata: [],
        _links: {
          bitstreams: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/bitstreams',
          owningCollection: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/owningCollection',
          templateItemOf: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5/templateItemOf',
          self: 'https://rest.api/dspace-spring-rest/api/core/items/6f344222-6980-4738-8192-b808d79af8a5'
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
              self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction'
            },
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction'
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
              self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
            },
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
          },
          {
            header: 'submit.progressbar.describe.stepone',
            mandatory: true,
            sectionType: 'submission-form',
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone'
            },
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone'
          },
          {
            header: 'submit.progressbar.describe.steptwo',
            mandatory: false,
            sectionType: 'submission-form',
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo'
            },
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo'
          },
          {
            header: 'submit.progressbar.upload',
            mandatory: true,
            sectionType: 'upload',
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload'
            },
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload'
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
              self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
            },
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
          }
        ],
        name: 'traditional',
        type: 'submissiondefinition',
        _links: {
          collections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections',
          sections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections',
          self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
        },
        self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
      }
    ],
    submitter: [],
    errors: [],
    self: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826',
    type: 'workspaceitem',
    _links: {
      collection: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/collection',
      item: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/item',
      submissionDefinition: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submissionDefinition',
      submitter: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826/submitter',
      self: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826'
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
          self: 'https://rest.api/dspace-spring-rest/api/authz/resourcePolicies/20',
          type: 'resourcePolicy',
          _links: {
            self: 'https://rest.api/dspace-spring-rest/api/authz/resourcePolicies/20'
          }
        }
      ]
    },
    logo: {
      sizeBytes: 7451,
      content: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content',
      format: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format',
      bundleName: null,
      self: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      id: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      uuid: '3f859425-ffbd-4b0e-bf91-bfeb458a7425',
      type: 'bitstream',
      name: null,
      metadata: [],
      _links: {
        content: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/content',
        format: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425/format',
        self: 'https://rest.api/dspace-spring-rest/api/core/bitstreams/3f859425-ffbd-4b0e-bf91-bfeb458a7425'
      }
    },
    self: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb',
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
      license: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/license',
      defaultAccessConditions: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultAccessConditions',
      logo: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/logo',
      self: 'https://rest.api/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb'
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
    self: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270',
    id: 'cae8af78-c874-4468-af79-e6c996aa8270',
    uuid: 'cae8af78-c874-4468-af79-e6c996aa8270',
    type: 'item',
    name: null,
    metadata: [],
    _links: {
      bitstreams: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/bitstreams',
      owningCollection: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/owningCollection',
      templateItemOf: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270/templateItemOf',
      self: 'https://rest.api/dspace-spring-rest/api/core/items/cae8af78-c874-4468-af79-e6c996aa8270'
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
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
          },
          self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
        },
        {
          header: 'submit.progressbar.describe.stepone',
          mandatory: true,
          sectionType: 'submission-form',
          type: 'submissionsection',
          _links: {
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone'
          },
          self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone'
        },
        {
          header: 'submit.progressbar.describe.steptwo',
          mandatory: true,
          sectionType: 'submission-form',
          type: 'submissionsection',
          _links: {
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo'
          },
          self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo'
        },
        {
          header: 'submit.progressbar.upload',
          mandatory: true,
          sectionType: 'upload',
          type: 'submissionsection',
          _links: {
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload'
          },
          self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload'
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
            self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
          },
          self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
        }
      ]
    },
    name: 'traditional',
    type: 'submissiondefinition',
    _links: {
      collections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections',
      sections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections',
      self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
    },
    self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional',
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
    self: 'https://rest.api/dspace-spring-rest/api/eperson/epersons/99423c27-b642-4bb9-a9cd-6d910e68dca5',
    id: '99423c27-b642-4bb9-a9cd-6d910e68dca5',
    uuid: '99423c27-b642-4bb9-a9cd-6d910e68dca5',
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
      self: 'https://rest.api/dspace-spring-rest/api/eperson/epersons/99423c27-b642-4bb9-a9cd-6d910e68dca5'
    }
  },
  id: 826,
  lastModified: '2019-01-09T10:17:33.738+0000',
  sections: {
    license: {
      url: null,
      acceptanceDate: null,
      granted: false
    },
    upload: {
      files: []
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
  self: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/269',
  type: 'workspaceitem',
  _links: {
    collection: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/269/collection',
    item: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/269/item',
    submissionDefinition: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/269/submissionDefinition',
    submitter: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/269/submitter',
    self: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/269'
  }
}
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
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction'
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
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
    },
    {
      header: 'submit.progressbar.describe.stepone',
      mandatory: true,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone'
    },
    {
      header: 'submit.progressbar.describe.steptwo',
      mandatory: false,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo'
    },
    {
      header: 'submit.progressbar.upload',
      mandatory: true,
      sectionType: 'upload',
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload'
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
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
    }
  ],
  name: 'traditional',
  type: 'submissiondefinition',
  _links: {
    collections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections',
    sections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections',
    self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
  },
  self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
} as any;

export const mockSubmissionDefinition: SubmissionDefinitionsModel = {
  isDefault: true,
  sections: new PaginatedList(new PageInfo(),[
    {
      mandatory: true,
      sectionType: 'utils',
      visibility: {
        main: 'HIDDEN',
        other: 'HIDDEN'
      },
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/extraction'
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
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/collection'
    },
    {
      header: 'submit.progressbar.describe.stepone',
      mandatory: true,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpageone'
    },
    {
      header: 'submit.progressbar.describe.steptwo',
      mandatory: false,
      sectionType: 'submission-form',
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpagetwo'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/traditionalpagetwo'
    },
    {
      header: 'submit.progressbar.upload',
      mandatory: true,
      sectionType: 'upload',
      type: 'submissionsection',
      _links: {
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/upload'
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
        self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
      },
      self: 'https://rest.api/dspace-spring-rest/api/config/submissionsections/license'
    }
  ]),
  name: 'traditional',
  type: 'submissiondefinition',
  _links: {
    collections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/collections',
    sections: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional/sections',
    self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
  },
  self: 'https://rest.api/dspace-spring-rest/api/config/submissiondefinitions/traditional'
} as any;

export const mockSubmissionState: SubmissionObjectState = {
  826: {
    collection: mockSubmissionCollectionId,
    definition: 'traditional',
    selfUrl: mockSubmissionSelfUrl,
    activeSection: null,
    sections: {
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
        isValid: false
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
        isValid: false
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
        isValid: false
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
        isValid: false
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
        isValid: false
      } as any
    },
    isLoading: false,
    savePending: false,
    depositPending: false
  }
};
