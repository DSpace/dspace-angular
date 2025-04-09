// This configuration is only used for unit tests, end-to-end tests use environment.production.ts
import { BuildConfig } from 'src/config/build-config.interface';
import { RestRequestMethod } from '../app/core/data/rest-request-method';
import { NotificationAnimationsType } from '../app/shared/notifications/models/notification-animations-type';
import { AdvancedAttachmentElementType } from '../config/advanced-attachment-rendering.config';
import { IdentifierSubtypesIconPositionEnum } from 'src/config/identifier-subtypes-config.interface';

export const environment: BuildConfig = {
  production: false,

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false,
    inlineCriticalCss: false,
    transferState: true,
    replaceRestUrl: false,
    paths: [ '/home', '/items/', '/entities/', '/collections/', '/communities/', '/bitstream/', '/bitstreams/', '/handle/', '/reload/' ],
    enableSearchComponent: false,
    enableBrowseComponent: false,
  },

  // Angular Universal server settings.
  ui: {
    ssl: false,
    host: 'dspace.com',
    port: 80,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/angular-dspace',
    baseUrl: 'http://dspace.com/angular-dspace',
    // The rateLimiter settings limit each IP to a 'max' of 500 requests per 'windowMs' (1 minute).
    rateLimiter: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 500 // limit each IP to 500 requests per windowMs
    },
    useProxies: true,
  },

  // The REST API server settings.
  rest: {
    ssl: true,
    host: 'rest.com',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/api',
    baseUrl: 'https://rest.com/api'
  },

  actuators: {
    endpointPath: '/actuator/health'
  },

  // Caching settings
  cache: {
    // NOTE: how long should objects be cached for by default
    msToLive: {
      default: 15 * 60 * 1000, // 15 minutes
    },
    // msToLive: 1000, // 15 minutes
    control: 'max-age=60',
    autoSync: {
      defaultTime: 0,
      maxBufferSize: 100,
      timePerMethod: { [RestRequestMethod.PATCH]: 3 } as any // time in seconds
    },
    // In-memory cache of server-side rendered pages. Disabled in test environment (max=0)
    serverSide: {
      debug: false,
      headers: ['Link'],
      botCache: {
        max: 0,
        timeToLive: 24 * 60 * 60 * 1000, // 1 day
        allowStale: true,
      },
      anonymousCache: {
        max: 0,
        timeToLive: 10 * 1000, // 10 seconds
        allowStale: true,
      }
    }
  },

  // Authentication settings
  auth: {
    // Authentication UI settings
    ui: {
      // the amount of time before the idle warning is shown
      timeUntilIdle: 20000,

      // the amount of time the user has to react after the idle warning is shown before they are logged out.
      idleGracePeriod: 20000, // 20 sec
    },
    // Authentication REST settings
    rest: {
      // If the rest token expires in less than this amount of time, it will be refreshed automatically.
      // This is independent from the idle warning.
      timeLeftBeforeTokenRefresh: 20000, // 20 sec
    },
  },

  // Form settings
  form: {
    spellCheck: true,
    // NOTE: Map server-side validators to comparative Angular form validators
    validatorMap: {
      required: 'required',
      regex: 'pattern'
    }
  },

  // Notifications
  notifications: {
    rtl: false,
    position: ['top', 'right'],
    maxStack: 8,
    // NOTE: after how many seconds notification is closed automatically. If set to zero notifications are not closed automatically
    timeOut: 5000,
    clickToClose: true,
    // NOTE: 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale'
    animate: NotificationAnimationsType.Scale
  },

  // Submission settings
  submission: {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
      // NOTE: every how many minutes submission is saved automatically
      timer: 5
    },
    typeBind: {
      field: 'dc.type'
    },
    icons: {
      metadata: [
        {
          name: 'mainField',
          style: 'fas fa-user'
        },
        {
          name: 'relatedField',
          style: 'fas fa-university'
        },
        {
          name: 'otherRelatedField',
          style: 'fas fa-circle'
        },
        {
          name: 'default',
          style: ''
        }
      ],
      authority: {
        confidence: [
          {
            value: 600,
            style: 'text-success'
          },
          {
            value: 500,
            style: 'text-warning'
          },
          {
            value: 400,
            style: 'text-danger'
          },
          {
            value: 300,
            style: 'text-dark'
          },
          {
            value: 200,
            style: 'text-dark'
          },
          {
            value: 100,
            style: 'text-dark'
          },
          // default configuration
          {
            value: 'default',
            style: 'text-muted'
          }
        ]
      }
    },
    detectDuplicate: {
      // NOTE: list of additional item metadata to show for duplicate match presentation list
      metadataDetailsList: [
        { label: 'Document type', name: 'dc.type' }
      ]
    }
  },

  // NOTE: will log all redux actions and transfers in console
  debug: false,

  // Default Language in which the UI will be rendered if the user's browser language is not an active language
  defaultLanguage: 'en',

  // Languages. DSpace Angular holds a message catalog for each of the following languages.
  // When set to active, users will be able to switch to the use of this language in the user interface.
  languages: [{
    code: 'en',
    label: 'English',
    active: true,
  }, {
    code: 'de',
    label: 'Deutsch',
    active: true,
  }, {
    code: 'cs',
    label: 'Čeština',
    active: true,
  }, {
    code: 'nl',
    label: 'Nederlands',
    active: true,
  }, {
    code: 'pt',
    label: 'Português',
    active: true,
  }, {
    code: 'fr',
    label: 'Français',
    active: true,
  }, {
    code: 'lv',
    label: 'Latviešu',
    active: true,
  }, {
    code: 'bn',
    label: 'বাংলা',
    active: true,
  }, {
    code: 'el',
    label: 'Ελληνικά',
    active: true,
  }, {
    code: 'disabled',
    label: 'Disabled',
    active: false,
  }],

  // Browse-By Pages
  browseBy: {
    // Amount of years to display using jumps of one year (current year - oneYearLimit)
    oneYearLimit: 10,
    // Limit for years to display using jumps of five years (current year - fiveYearLimit)
    fiveYearLimit: 30,
    // The absolute lowest year to display in the dropdown (only used when no lowest date can be found for all items)
    defaultLowerLimit: 1900,
    // Whether to add item badges to BOTH browse and search result lists.
    showLabels: true,
    // Whether to add item thumbnail images to BOTH browse and search result lists.
    showThumbnails: true,
    // Whether to add item thumbnail images to BOTH browse and search result lists.
    showMetrics: false,
    // The number of entries in a paginated browse results list.
    // Rounded to the nearest size in the list of selectable sizes on the
    // settings menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
    pageSize: 20,
  },
  communityList: {
    pageSize: 20
  },
  homePage: {
    recentSubmissions: {
      pageSize: 5,
      //sort record of recent submission
      sortField: 'dc.date.accessioned',
    },
    topLevelCommunityList: {
      pageSize: 5
    }
  },
  followAuthorityMetadata: [
    {
      type: 'Publication',
      metadata: ['dc.contributor.author']
    }
  ],
  followAuthorityMaxItemLimit: 100,
  followAuthorityMetadataValuesLimit: 5,
  item: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    },
    // Show the item access status label in items lists
    showAccessStatuses: false,
    bitstream: {
      // Number of entries in the bitstream list in the item view page.
      // Rounded to the nearest size in the list of selectable sizes on the
      // settings menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
      pageSize: 5
    },
    // The maximum number of metadata values to add to the metatag list of the item page
    metatagLimit: 20,

    // The maximum number of values for repeatable metadata to show in the full item
    metadataLimit: 20
  },
  collection: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  },
  themes: [
    {
      name: 'full-item-page-theme',
      regex: 'items/aa6c6c83-3a83-4953-95d1-2bc2e67854d2/full'
    },
    {
      name: 'error-theme',
      regex: 'collections/aaaa.*'
    },
    {
      name: 'handle-theme',
      handle: '10673/1233'
    },
    {
      name: 'regex-theme',
      regex: 'collections\/e8043bc2.*'
    },
    {
      name: 'uuid-theme',
      uuid: '0958c910-2037-42a9-81c7-dca80e3892b4'
    },
    {
      name: 'base',
    },
  ],
  bundle: {
    standardBundles: ['ORIGINAL', 'THUMBNAIL', 'LICENSE'],
  },
  mediaViewer: {
    image: true,
    video: true
  },
  info: {
    enableEndUserAgreement: true,
    enablePrivacyStatement: true,
    //Configuration for third-party metrics in Klaro
    metricsConsents: [
      {
        key: 'plumX',
        enabled: true
      },
      {
        key: 'altmetric',
        enabled: true
      },
      {
        key: 'dimensions',
        enabled: true
      },
    ]
  },
  markdown: {
    enabled: false,
    mathjax: false,
  },
  comcolSelectionSort: {
    sortField:'dc.title',
    sortDirection:'ASC',
  },

  vocabularies: [
    {
      filter: 'subject',
      vocabulary: 'srsc',
      enabled: true
    }
  ],

  liveRegion: {
    messageTimeOutDurationMs: 30000,
    isVisible: false,
  },

  search: {
    filterPlaceholdersCount: 5
  },

  crisLayout: {
    urn: [
      {
        name: 'doi',
        baseUrl: 'https://doi.org/'
      },
      {
        name: 'keepMyWhiteSpaces',
        baseUrl: 'https://keepmywhitespaces.com/',
        shouldKeepWhiteSpaces: true
      },
      {
        name: 'hdl',
        baseUrl: 'https://hdl.handle.net/'
      },
      {
        name: 'mailto',
        baseUrl: 'mailto:'
      }
    ],
    crisRef: [
      {
        entityType: 'DEFAULT',
        entityStyle: {
          default: {
            icon: 'fa fa-user',
            style: 'text-success'
          }
        }
      },
      {
        entityType: 'PERSON',
        entityStyle: {
          person: {
            icon: 'fa fa-user',
            style: 'text-success'
          },
          personStaff: {
            icon: 'fa fa-user',
            style: 'text-primary'
          },
          default: {
            icon: 'fa fa-user',
            style: 'text-success'
          }
        }
      },
      {
        entityType: 'ORGUNIT',
        entityStyle: {
          default: {
            icon: 'fa fa-university',
            style: 'text-success'
          }
        }
      }
    ],
    crisRefStyleMetadata: {
      default: 'cris.entity.style',
    },
    itemPage: {
      Person: {
        orientation: 'horizontal'
      },
      OrgUnit: {
        orientation: 'horizontal'
      },
      default: {
        orientation: 'vertical'
      },
    },
    metadataBox: {
      defaultMetadataLabelColStyle: 'col-3',
      defaultMetadataValueColStyle: 'col-9'
    },
    collectionsBox: {
      defaultCollectionsLabelColStyle: 'col-3 font-weight-bold',
      defaultCollectionsValueColStyle: 'col-9',
      isInline: true
    }
  },
  layout: {
    navbar: {
      // If true, show the "Community and Collections" link in the navbar; otherwise, show it in the admin sidebar
      showCommunityCollection: true,
    }
  },
  security: {
    levels: [
      {
        value: 0,
        icon: 'fa fa-globe',
        color: 'green'
      },
      {
        value: 1,
        icon: 'fa fa-key',
        color: 'orange'
      },
      {
        value: 2,
        icon: 'fa fa-lock',
        color: 'red'
      }]
  },
  suggestion: [
  ],
  cms: {
    metadataList: [
      'cris.cms.home-header',
      'cris.cms.home-news',
      'cris.cms.footer',
    ]
  },
  addToAnyPlugin: {
    scriptUrl: 'https://static.addtoany.com/menu/page.js',
    socialNetworksEnabled: true,
    buttons: ['btn1', 'btn2'],
    showPlusButton: true,
    showCounters: true,
    title: 'DSpace CRIS 7 demo',
  },
  metricVisualizationConfig: [
    {
      type: 'altmetric',
      icon: null,
      class: 'alert-light',
    },
    {
      type: 'plumX',
      icon: null,
      class: null,
    },
    {
      type: 'dimensions',
      icon: 'fa fa-cubes',
      class: 'alert-secondary',
    },
    {
      type: 'google-scholar',
      icon: '/assets/images/google-scholar.svg',
      class: 'alert-info',
    },
    {
      type: 'embedded-view',
      icon: 'fa fa-eye',
      class: 'alert-success'
    },
    {
      type: 'embedded-download',
      icon: 'fa fa-cloud-download-alt',
      class: 'alert-danger',
    },
    {
      type: 'view',
      icon: 'fa fa-eye',
      class: 'alert-success',
    },
    {
      type: 'download',
      icon: 'fa fa-cloud-download-alt',
      class: 'alert-danger',
    },
  ],

  attachmentRendering: {
    pagination: {
      enabled: true,
      elementsPerPage: 2
    },
  },

  advancedAttachmentRendering: {
    pagination: {
      enabled: true,
      elementsPerPage: 2
    },
    metadata: [
      {
        name: 'dc.title',
        type: AdvancedAttachmentElementType.Metadata,
        truncatable: false
      },
      {
        name: 'dc.type',
        type: AdvancedAttachmentElementType.Metadata,
        truncatable: false
      },
      {
        name: 'dc.description',
        type: AdvancedAttachmentElementType.Metadata,
        truncatable: true
      },
      {
        name: 'size',
        type: AdvancedAttachmentElementType.Attribute,
      },
      {
        name: 'format',
        type: AdvancedAttachmentElementType.Attribute,
      },
      {
        name: 'checksum',
        type: AdvancedAttachmentElementType.Attribute,
      }
    ]
  },

  searchResult: {
    additionalMetadataFields: [
      {
        entityType: 'default',
        metadataConfiguration: []
      }
    ],
    authorMetadata: ['dc.contributor.author', 'dc.contributor.editor', 'dc.contributor.contributor', 'dc.creator'],
  },

  mirador: {
    enableDownloadPlugin: true,
  },

  loader: {
    showFallbackMessagesByDefault: true,
    warningMessageDelay: 1000,
    errorMessageDelay: 2000,
    numberOfAutomaticPageReloads: 2,
  },

  metaTags: {
    defaultLogo: '/assets/images/dspace-cris-logo.png',
    defaultDescription: 'DSpace is the most widely used repository software with more than 3000 installations around the world. It is free, open source and completely customisable to fit the needs of any organisation.'
  },

  identifierSubtypes: [
    {
      name: 'ror',
      icon: 'assets/images/ror.logo.icon.svg',
      iconPosition: IdentifierSubtypesIconPositionEnum.LEFT,
      link: 'https://ror.org'
    }
  ],
  // Configuration for the metadata link view popover
  metadataLinkViewPopoverData:
  {
    fallbackMetdataList: ['dc.description.abstract'],

    entityDataConfig: [
      {
        entityType: 'Person',
        metadataList: ['person.affiliation.name', 'person.email', 'person.identifier.orcid', 'dc.description.abstract']
      },
      {
        entityType: 'OrgUnit',
        metadataList: ['organization.parentOrganization', 'organization.identifier.ror', 'crisou.director', 'dc.description.abstract']
      },
      {
        entityType: 'Project',
        metadataList: ['oairecerif.project.status', 'dc.description.abstract']
      },
      {
        entityType: 'Funding',
        metadataList: ['oairecerif.funder', 'oairecerif.fundingProgram', 'dc.description.abstract']
      },
      {
        entityType: 'Publication',
        metadataList: ['dc.identifier.doi', 'dc.identifier.uri', 'dc.description.abstract']
      },
    ]
  },
};
