import { Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { PaginatedList } from './paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { ErrorResponse, GenericSuccessResponse, RestResponse } from '../cache/response.models';

@Injectable()
export class MappingCollectionsReponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    if (payload._embedded && payload._embedded.mappingCollections) {
      const mappingCollections = payload._embedded.mappingCollections;
      // TODO: When the API supports it, change this to fetch a paginated list, instead of creating static one
      // Reason: Pagination is currently not supported on the mappingCollections endpoint
      const paginatedMappingCollections = new PaginatedList(Object.assign(new PageInfo(), {
        elementsPerPage: mappingCollections.length,
        totalElements: mappingCollections.length,
        totalPages: 1,
        currentPage: 1
      }), mappingCollections);
      return new GenericSuccessResponse(paginatedMappingCollections, data.statusCode);
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
