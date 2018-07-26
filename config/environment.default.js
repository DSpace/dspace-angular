module.exports = {
  // Angular Universal server settings.
  ui: {
    ssl: false,
    host: 'localhost',
    port: 3000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/'
  },
  // The REST API server settings.
  rest: {
    ssl: true,
    host: 'dspace7.4science.it',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/dspace-spring-rest/api'
  },
  // Caching settings
  cache: {
    // NOTE: how long should objects be cached for by default
    msToLive: 15 * 60 * 1000, // 15 minutes
    // msToLive: 1000, // 15 minutes
    control: 'max-age=60' // revalidate browser
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
    animate: 'scale'
  },
  // Submission settings
  submission: {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
      // NOTE: every how many minutes submission is saved automatically
      timer: 5
    },
    metadata: {
      // NOTE: allow to set icons used to represent metadata belonging to a relation group
      icons: [
        /**
         * NOTE: example of configuration
         * {
         *    // NOTE: metadata name
         *    name: 'dc.author',
         *    config: {
         *      // NOTE: used when metadata value has an authority
         *      withAuthority: {
         *        // NOTE: fontawesome (v4.x) icon classes and bootstrap color utility classes can be used
         *        style: 'fa-user'
         *      },
         *      // NOTE: used when metadata value has not an authority
         *      withoutAuthority: {
         *        style: 'fa-user text-muted'
         *      }
         *    }
         * }
         */
        // default configuration
        {
          name: 'default',
          config: {}
        }
      ]
    }
  },
  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  },
  // Google Analytics tracking id
  gaTrackingId: '',
  // Log directory
  logDirectory: '.',
  // NOTE: will log all redux actions and transfers in console
  debug: false
};
