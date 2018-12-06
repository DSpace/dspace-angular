import { Injectable } from '@angular/core';

import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { MetadataschemaSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { MetadataSchema } from '../metadata/metadataschema.model';

@Injectable()
export class MetadataschemaParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceRESTv2Serializer(MetadataSchema).deserialize(payload);
    return new MetadataschemaSuccessResponse(deserialized, data.statusCode);
  }

}
