import { Config } from './config';

interface AutosaveConfig {
  metadata: string[];
  timer: number;
}

interface DuplicateDetectionConfig {
  alwaysShowSection: boolean;
}

interface TypeBindConfig {
  field: string;
}

interface IconsConfig {
  metadata: MetadataIconConfig[];
  authority: {
    confidence: ConfidenceIconConfig[];
  };
}

export interface MetadataIconConfig {
  name: string;
  style: string;
}

export interface ConfidenceIconConfig {
  value: any;
  style: string;
  icon: string;
}

export class SubmissionConfig extends Config {
  @Config.public autosave: AutosaveConfig = {
    // NOTE: which metadata trigger an autosave
    metadata: [],
    /**
     * NOTE: after how many time (milliseconds) submission is saved automatically
     * eg. timer: 5 * (1000 * 60); // 5 minutes
     */
    timer: 0,
  };
  @Config.public duplicateDetection: DuplicateDetectionConfig = {
    alwaysShowSection: false,
  };
  @Config.public typeBind: TypeBindConfig = {
    field: 'dc.type',
  };
  @Config.public icons: IconsConfig = {
    metadata: [
      /**
       * NOTE: example of configuration
       * {
       *    // NOTE: metadata name
       *    name: 'dc.author',
       *    // NOTE: fontawesome (v6.x) icon classes and bootstrap utility classes can be used
       *    style: 'fa-user'
       * }
       */
      {
        name: 'dc.author',
        style: 'fas fa-user',
      },
      // default configuration
      {
        name: 'default',
        style: '',
      },
    ],
    authority: {
      confidence: [
        /**
         * NOTE: example of configuration
         * {
         *    // NOTE: confidence value
         *    value: 100,
         *    // NOTE: fontawesome (v6.x) icon classes and bootstrap utility classes can be used
         *    style: 'text-success',
         *    icon: 'fa-circle-check'
         *    // NOTE: the class configured in property style is used by default, the icon property could be used in component
         *    //      configured to use a 'icon mode' display (mainly in edit-item page)
         * }
         */
        {
          value: 600,
          style: 'text-success',
          icon: 'fa-circle-check',
        },
        {
          value: 500,
          style: 'text-info',
          icon: 'fa-gear',
        },
        {
          value: 400,
          style: 'text-warning',
          icon: 'fa-circle-question',
        },
        {
          value: 300,
          style: 'text-muted',
          icon: 'fa-circle-question',
        },
        {
          value: 200,
          style: 'text-muted',
          icon: 'fa-circle-exclamation',
        },
        {
          value: 100,
          style: 'text-muted',
          icon: 'fa-circle-stop',
        },
        {
          value: 0,
          style: 'text-muted',
          icon: 'fa-ban',
        },
        {
          value: -1,
          style: 'text-muted',
          icon: 'fa-circle-xmark',
        },
        // default configuration
        {
          value: 'default',
          style: 'text-muted',
          icon: 'fa-circle-xmark',
        },

      ],
    },
  };
}
