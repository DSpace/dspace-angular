import {
  GenericConstructor,
  PostRequest,
  ResponseParsingService,
  StatusCodeOnlyResponseParsingService,
} from '@dspace/core';

export class TrackRequest extends PostRequest {

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return StatusCodeOnlyResponseParsingService;
  }
}
