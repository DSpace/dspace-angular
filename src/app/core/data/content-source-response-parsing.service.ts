import { Injectable } from '@angular/core';
import { ContentSourceSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { ContentSource } from '../shared/content-source.model';
import { MetadataConfig } from '../shared/metadata-config.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to a ContentSource object
 * wrapped in a ContentSourceSuccessResponse
 */
export class ContentSourceResponseParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const deserialized = new DSpaceSerializer(ContentSource).deserialize(payload);

    let metadataConfigs = [];
    if (payload._embedded && payload._embedded.harvestermetadata && payload._embedded.harvestermetadata.configs) {
      metadataConfigs = new DSpaceSerializer(MetadataConfig).serializeArray(payload._embedded.harvestermetadata.configs);
    }
    deserialized.metadataConfigs = metadataConfigs;

    return new ContentSourceSuccessResponse(deserialized, data.statusCode, data.statusText);
  }

}
