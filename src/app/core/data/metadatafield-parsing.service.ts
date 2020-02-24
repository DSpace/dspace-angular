import { Injectable } from '@angular/core';
import { MetadatafieldSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { MetadataField } from '../metadata/metadata-field.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

/**
 * A service responsible for parsing DSpaceRESTV2Response data related to a single MetadataField to a valid RestResponse
 */
@Injectable()
export class MetadatafieldParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceSerializer(MetadataField).deserialize(payload);
    return new MetadatafieldSuccessResponse(deserialized, data.statusCode, data.statusText);
  }

}
