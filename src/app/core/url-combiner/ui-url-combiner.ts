import { URLCombiner } from './url-combiner';
import { GlobalConfig } from '../../../config';

/**
 * Combines a variable number of strings representing parts
 * of a relative UI URL in to a single, absolute UI URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
export class UIURLCombiner extends URLCombiner {
  constructor(EnvConfig: GlobalConfig, ...parts: string[]) {
    super(EnvConfig.ui.baseUrl, EnvConfig.ui.nameSpace, ...parts);
  }
}
