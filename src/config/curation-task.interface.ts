import { Config } from './config.interface';

/**
 * An interface to represent a curation task in the configuration. A CurationTask has a name and a label.
 */
export interface CurationTask extends Config {
      name: string;
      label: string;
}
