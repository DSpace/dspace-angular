import { environment } from '../../../environments/environment';
import { URLCombiner } from './url-combiner';

/**
 * Combines a variable number of strings representing parts
 * of a relative UI URL in to a single, absolute UI URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
export class UIURLCombiner extends URLCombiner {
  constructor(...parts: string[]) {
    super(environment.ui.baseUrl, ...parts);
  }
}
