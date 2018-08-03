export const submissionRestREsponse = [
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
    errors: [
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
    ],
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
