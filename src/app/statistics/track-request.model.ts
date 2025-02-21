import { ResponseParsingService } from '../../../modules/core/src/lib/core/data/parsing.service';
import { PostRequest } from '../../../modules/core/src/lib/core/data/request.models';
import { StatusCodeOnlyResponseParsingService } from '../../../modules/core/src/lib/core/data/status-code-only-response-parsing.service';
import { GenericConstructor } from '../../../modules/core/src/lib/core/shared/generic-constructor';

export class TrackRequest extends PostRequest {

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return StatusCodeOnlyResponseParsingService;
  }
}
