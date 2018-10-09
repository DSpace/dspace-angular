import { Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ErrorResponse, GenericSuccessResponse, RestResponse } from '../cache/response-cache.models';

@Injectable()
export class MappingCollectionsReponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    if (payload._embedded && payload._embedded.mappingCollections) {
      const mappingCollections = payload._embedded.mappingCollections;
      return new GenericSuccessResponse(mappingCollections, data.statusCode);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from mappingCollections endpoint'),
          { statusText: data.statusCode }
        )
      );
    }
  }
}
