import {
  ResponseParsingService,
  PostRequest,
  StatusCodeOnlyResponseParsingService,
  GenericConstructor,
} from '@dspace/core'

export class TrackRequest extends PostRequest {

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return StatusCodeOnlyResponseParsingService;
  }
}
