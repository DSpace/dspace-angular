import { Config } from './config.interface';

export interface StandardBundleConfig extends Config {

  /**
   * Used by {@link UploadBitstreamComponent}.
   */
  bundle: string;

}
