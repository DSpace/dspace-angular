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
    host: 'dspace7-entities.atmire.com',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/rest/api'
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
      timePerMethod: {'PATCH': 3} //time in seconds
    }
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
  debug: false,
  // Default Language in which the UI will be rendered if the user's browser language is not an active language
  defaultLanguage: 'en',
  // Languages. DSpace Angular holds a message catalog for each of the following languages. When set to active, users will be able to switch to the use of this language in the user interface.
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
    active: false,
  }],
  item: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  }
};
