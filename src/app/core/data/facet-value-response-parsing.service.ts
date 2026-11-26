import { Injectable } from '@angular/core';

import { ParsedResponse } from '../cache/response.models';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { FacetValue } from '../shared/search/models/facet-value.model';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { PaginatedList } from './paginated-list.model';
import { RestRequest } from './rest-request.model';

@Injectable({ providedIn: 'root' })
export class FacetValueResponseParsingService extends DspaceRestResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse {
    const payload = data.payload;
    const facetValues: PaginatedList<any> = new DSpaceSerializer(PaginatedList).deserialize(payload);
    facetValues.pageInfo = this.processPageInfo(payload);
    facetValues.page = new DSpaceSerializer(FacetValue).deserializeArray(payload._embedded.values);
    this.addToObjectCache(facetValues, request, data);
    return new ParsedResponse(data.statusCode, facetValues._links.self);
  }
}
