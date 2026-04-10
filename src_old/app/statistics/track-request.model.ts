import { ResponseParsingService } from '@dspace/core/data/parsing.service';
import { PostRequest } from '@dspace/core/data/request.models';
import { StatusCodeOnlyResponseParsingService } from '@dspace/core/data/status-code-only-response-parsing.service';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';

export class TrackRequest extends PostRequest {

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return StatusCodeOnlyResponseParsingService;
  }
}
