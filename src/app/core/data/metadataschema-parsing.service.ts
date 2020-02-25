import { Injectable } from '@angular/core';
import { MetadataschemaSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class MetadataschemaParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceSerializer(MetadataSchema).deserialize(payload);
    return new MetadataschemaSuccessResponse(deserialized, data.statusCode, data.statusText);
  }

}
