import { HttpOptions } from '../dspace-rest';
import { RestRequestMethod } from './rest-request-method';

/**
 * A request to the DSpace REST API
 */
export abstract class RestRequest {
  public isMultipart = false;

  constructor(
        public uuid: string,
        public href: string,
        public method: RestRequestMethod = RestRequestMethod.GET,
        public body?: any,
        public options?: HttpOptions,
        public responseMsToLive?: number,
  ) {
  }
}
