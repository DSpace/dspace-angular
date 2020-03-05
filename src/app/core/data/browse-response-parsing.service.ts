import { Injectable } from '@angular/core';
import { isNotEmpty } from '../../shared/empty.util';
import { ErrorResponse, GenericSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class BrowseResponseParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._embedded)
      && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
      const serializer = new DSpaceSerializer(BrowseDefinition);
      const browseDefinitions = serializer.deserializeArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]]);
      return new GenericSuccessResponse(browseDefinitions, data.statusCode, data.statusText);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from browse endpoint'),
          { statusCode: data.statusCode, statusText: data.statusText }
        )
      );
    }
  }
}
