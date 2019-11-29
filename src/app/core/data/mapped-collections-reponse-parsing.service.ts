import { Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { PaginatedList } from './paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { ErrorResponse, GenericSuccessResponse, RestResponse } from '../cache/response.models';

@Injectable()
/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to a GenericSuccessResponse
 * containing a PaginatedList of mapped collections
 */
export class MappedCollectionsReponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    if (payload._embedded && payload._embedded.mappedCollections) {
      const mappedCollections = payload._embedded.mappedCollections;
      // TODO: When the API supports it, change this to fetch a paginated list, instead of creating static one
      // Reason: Pagination is currently not supported on the mappedCollections endpoint
      const paginatedMappedCollections = new PaginatedList(Object.assign(new PageInfo(), {
        elementsPerPage: mappedCollections.length,
        totalElements: mappedCollections.length,
        totalPages: 1,
        currentPage: 1
      }), mappedCollections);
      return new GenericSuccessResponse(paginatedMappedCollections, data.statusCode, data.statusText);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from mappedCollections endpoint'), data
        )
      );
    }
  }
}
