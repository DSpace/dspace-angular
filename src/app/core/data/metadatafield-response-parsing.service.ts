import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { MetadataField } from '../metadata/metadata-field.model';
import { RestRequest } from './request.models';
import { ResponseParsingService } from './parsing.service';
import { Injectable } from '@angular/core';
import { MetadatafieldSuccessResponse, RestResponse } from '../cache/response.models';

@Injectable()
export class MetadatafieldParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceSerializer(MetadataField).deserialize(payload);
    return new MetadatafieldSuccessResponse(deserialized, data.statusCode, data.statusText);
  }

}
