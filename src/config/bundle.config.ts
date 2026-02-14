import { Config } from './config';

export class BundleConfig extends Config {
  /**
   * List of standard bundles to select in adding bitstreams to items
   * Used by {@link UploadBitstreamComponent}.
   */
  @Config.publish() standardBundles: string[];
}
