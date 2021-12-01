import { GlobalConfig } from '../config/global-config.interface';
import { NotificationAnimationsType } from '../app/shared/notifications/models/notification-animations-type';
import { BrowseByType } from '../app/browse-by/browse-by-switcher/browse-by-decorator';
import { RestRequestMethod } from '../app/core/data/rest-request-method';

export const environment: GlobalConfig = {
  production: true,
  // Angular Universal server settings.
  // NOTE: these must be "synced" with the 'dspace.ui.url' setting in your backend's local.cfg.
  ui: {
    ssl: false,
    host: 'localhost',
    port: 4000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/',
    // The rateLimiter settings limit each IP to a "max" of 500 requests per "windowMs" (1 minute).
    rateLimiter: {
      windowMs: 1 * 60 * 1000,   // 1 minute
      max: 500 // limit each IP to 500 requests per windowMs
    }
  },
  // The REST API server settings.
  // NOTE: these must be "synced" with the 'dspace.server.url' setting in your backend's local.cfg.
  rest: {
    ssl: true,
    host: 'api7.dspace.org',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/server',
  },
  // Caching settings
  cache: {
    // NOTE: how long should objects be cached for by default
    msToLive: {
      default: 15 * 60 * 1000, // 15 minutes
    },
    // msToLive: 1000, // 15 minutes
    control: 'max-age=60', // revalidate browser
    autoSync: {
      defaultTime: 0,
      maxBufferSize: 100,
      timePerMethod: {[RestRequestMethod.PATCH]: 3} as any // time in seconds
    }
  },
  // Authentication settings
  auth: {
    // Authentication UI settings
    ui: {
      // the amount of time before the idle warning is shown
      timeUntilIdle: 15 * 60 * 1000, // 15 minutes
      // the amount of time the user has to react after the idle warning is shown before they are logged out.
      idleGracePeriod: 5 * 60 * 1000, // 5 minutes
    },
    // Authentication REST settings
    rest: {
      // If the rest token expires in less than this amount of time, it will be refreshed automatically.
      // This is independent from the idle warning.
      timeLeftBeforeTokenRefresh: 2 * 60 * 1000, // 2 minutes
    },
  },
  // Form settings
  form: {
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
    timeOut: 5000, // 5 second
    clickToClose: true,
    // NOTE: 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale'
    animate: NotificationAnimationsType.Scale
  },
  // Submission settings
  submission: {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: [],
      /**
       * NOTE: after how many time (milliseconds) submission is saved automatically
       * eg. timer: 5 * (1000 * 60); // 5 minutes
       */
      timer: 0
    },
    icons: {
      metadata: [
        /**
         * NOTE: example of configuration
         * {
         *    // NOTE: metadata name
         *    name: 'dc.author',
         *    // NOTE: fontawesome (v5.x) icon classes and bootstrap utility classes can be used
         *    style: 'fa-user'
         * }
         */
        {
          name: 'dc.author',
          style: 'fas fa-user'
        },
        // default configuration
        {
          name: 'default',
          style: ''
        }
      ],
      authority: {
        confidence: [
          /**
           * NOTE: example of configuration
           * {
           *    // NOTE: confidence value
           *    value: 'dc.author',
           *    // NOTE: fontawesome (v4.x) icon classes and bootstrap utility classes can be used
           *    style: 'fa-user'
           * }
           */
          {
            value: 600,
            style: 'text-success'
          },
          {
            value: 500,
            style: 'text-info'
          },
          {
            value: 400,
            style: 'text-warning'
          },
          // default configuration
          {
            value: 'default',
            style: 'text-muted'
          },

        ]
      }
    }
  },
  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
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
    code: 'cs',
    label: 'Čeština',
    active: true,
  }, {
    code: 'de',
    label: 'Deutsch',
    active: true,
  }, {
    code: 'es',
    label: 'Español',
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
    code: 'hu',
    label: 'Magyar',
    active: true,
  }, {
    code: 'nl',
    label: 'Nederlands',
    active: true,
  }, {
    code: 'pt-PT',
    label: 'Português',
    active: true,
  },{
    code: 'pt-BR',
    label: 'Português do Brasil',
    active: true,
  },{
    code: 'fi',
    label: 'Suomi',
    active: true,
  }],
  // Browse-By Pages
  browseBy: {
    // Amount of years to display using jumps of one year (current year - oneYearLimit)
    oneYearLimit: 10,
    // Limit for years to display using jumps of five years (current year - fiveYearLimit)
    fiveYearLimit: 30,
    // The absolute lowest year to display in the dropdown (only used when no lowest date can be found for all items)
    defaultLowerLimit: 1900,
    // List of all the active Browse-By types
    // Adding a type will activate their Browse-By page and add them to the global navigation menu,
    // as well as community and collection pages
    // Allowed fields and their purpose:
    //    id:             The browse id to use for fetching info from the rest api
    //    type:           The type of Browse-By page to display
    //    metadataField:  The metadata-field used to create starts-with options (only necessary when the type is set to 'date')
    types: [
      {
        id: 'title',
        type: BrowseByType.Title,
      },
      {
        id: 'dateissued',
        type: BrowseByType.Date,
        metadataField: 'dc.date.issued'
      },
      {
        id: 'author',
        type: BrowseByType.Metadata
      },
      {
        id: 'subject',
        type: BrowseByType.Metadata
      }
    ]
  },
  item: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  },
  collection: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  },
  themes: [
    // Add additional themes here. In the case where multiple themes match a route, the first one
    // in this list will get priority. It is advisable to always have a theme that matches
    // every route as the last one

    // {
    //   // A theme with a handle property will match the community, collection or item with the given
    //   // handle, and all collections and/or items within it
    //   name: 'custom',
    //   handle: '10673/1233'
    // },
    // {
    //   // A theme with a regex property will match the route using a regular expression. If it
    //   // matches the route for a community or collection it will also apply to all collections
    //   // and/or items within it
    //   name: 'custom',
    //   regex: 'collections\/e8043bc2.*'
    // },
    // {
    //   // A theme with a uuid property will match the community, collection or item with the given
    //   // ID, and all collections and/or items within it
    //   name: 'custom',
    //   uuid: '0958c910-2037-42a9-81c7-dca80e3892b4'
    // },
    // {
    //   // The extends property specifies an ancestor theme (by name). Whenever a themed component is not found
    //   // in the current theme, its ancestor theme(s) will be checked recursively before falling back to default.
    //   name: 'custom-A',
    //   extends: 'custom-B',
    //   // Any of the matching properties above can be used
    //   handle: '10673/34',
    // },
    // {
    //   name: 'custom-B',
    //   extends: 'custom',
    //   handle: '10673/12',
    // },
    // {
    //   // A theme with only a name will match every route
    //   name: 'custom'
    // },
    // {
    //   // This theme will use the default bootstrap styling for DSpace components
    //   name: BASE_THEME_NAME
    // },

    {
      // The default dspace theme
      name: 'dspace'
    },
  ],
  // Whether to enable media viewer for image and/or video Bitstreams (i.e. Bitstreams whose MIME type starts with "image" or "video").
  // For images, this enables a gallery viewer where you can zoom or page through images.
  // For videos, this enables embedded video streaming
  mediaViewer: {
    image: false,
    video: false,
  },
};
