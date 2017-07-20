import { URLCombiner } from './url-combiner';

import { GlobalConfig } from '../../../config';

/**
 * Combines a variable number of strings representing parts
 * of a relative REST URL in to a single, absolute REST URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
export class RESTURLCombiner extends URLCombiner {
  constructor(EnvConfig: GlobalConfig, ...parts: string[]) {
    super(EnvConfig.rest.baseUrl, EnvConfig.rest.nameSpace, ...parts);
  }
}
