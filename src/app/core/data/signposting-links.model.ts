import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';

export interface SignpostingLinks extends RawRestResponse {
    href?: string,
    rel?: string,
    type?: string
}
