import { Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ContentSourceSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { ContentSource } from '../shared/content-source.model';

@Injectable()
export class ContentSourceResponseParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceRESTv2Serializer(ContentSource).deserialize(payload);
    return new ContentSourceSuccessResponse(deserialized, data.statusCode, data.statusText);
  }

}
