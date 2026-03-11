import { URLCombiner } from './url-combiner';

/**
 * Combines a variable number of strings representing parts
 * of a relative REST URL in to a single, absolute REST URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
export class RESTURLCombiner extends URLCombiner {
  constructor(baseUrl: string, ...parts: string[]) {
    super(baseUrl, '/api', ...parts);
  }
}
