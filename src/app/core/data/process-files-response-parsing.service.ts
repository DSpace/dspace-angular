import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { GenericSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { PaginatedList } from './paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { Injectable } from '@angular/core';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { Bitstream } from '../shared/bitstream.model';

@Injectable()
/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to a GenericSuccessResponse
 * containing a PaginatedList of a process's output files
 */
export class ProcessFilesResponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    let page;
    if (isNotEmpty(payload._embedded) && isNotEmpty(Object.keys(payload._embedded))) {
      const bitstreams = new DSpaceSerializer(Bitstream).deserializeArray(payload._embedded[Object.keys(payload._embedded)[0]]);

      if (isNotEmpty(bitstreams)) {
        page = new PaginatedList(Object.assign(new PageInfo(), {
          elementsPerPage: bitstreams.length,
          totalElements: bitstreams.length,
          totalPages: 1,
          currentPage: 1
        }), bitstreams);
      }
    }

    if (isEmpty(page)) {
      page = new PaginatedList(new PageInfo(), []);
    }

    return new GenericSuccessResponse(page, data.statusCode, data.statusText);
  }
}
