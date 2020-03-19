// This configuration is currently only being used for unit tests, end-to-end tests use environment.dev.ts
import { environment as defaultEnv } from './environment.common';
import { GlobalConfig } from '../config/global-config.interface';
import { ServerConfig } from '../config/server-config.interface';

export const environment: GlobalConfig = {
  ...defaultEnv,

  rest: new ServerConfig(
    true,
    'rest.com',
    443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    '/api',
  ),
  ui: new ServerConfig(
    false,
    'dspace.com',
    80,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    '/angular-dspace',
  ),
  submission: {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
      // NOTE: every how many minutes submission is saved automatically
      timer: 5
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
            style: 'text-info'
          },
          {
            value: 400,
            style: 'text-warning'
          },
          {
            value: 'default',
            style: 'text-muted'
          },

        ]
      }
    }
  },
  languages: [{
    code: 'en',
    label: 'English',
    active: true,
  }, {
    code: 'de',
    label: 'Deutsch',
    active: true,
  }]
};
