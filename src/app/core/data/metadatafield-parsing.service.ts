import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { RestRequest } from './request.models';
import { ResponseParsingService } from './parsing.service';
import { Injectable } from '@angular/core';
import { MetadatafieldSuccessResponse, RestResponse } from '../cache/response.models';
import { MetadataField } from '../metadata/metadata-field.model';

/**
 * A service responsible for parsing DSpaceRESTV2Response data related to a single MetadataField to a valid RestResponse
 */
@Injectable()
export class MetadatafieldParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceRESTv2Serializer(MetadataField).deserialize(payload);
    return new MetadatafieldSuccessResponse(deserialized, data.statusCode, data.statusText);
  }

}
