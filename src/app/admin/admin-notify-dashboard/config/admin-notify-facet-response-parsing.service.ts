import { Injectable } from '@angular/core';
import { FacetConfigResponseParsingService } from '../../../core/data/facet-config-response-parsing.service';
import { RestRequest } from '../../../core/data/rest-request.model';
import { RawRestResponse } from '../../../core/dspace-rest/raw-rest-response.model';
import { ParsedResponse } from '../../../core/cache/response.models';
import { DSpaceSerializer } from '../../../core/dspace-rest/dspace.serializer';
import { AdminNotifySearchFilterConfig } from './admin-notify-search-filter-config';
import { FacetConfigResponse } from '../../../shared/search/models/facet-config-response.model';

@Injectable()
export class AdminNotifyFacetResponseParsingService extends FacetConfigResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse {

    const config = data.payload._embedded.facets;
    const serializer = new DSpaceSerializer(AdminNotifySearchFilterConfig);
    const filters = serializer.deserializeArray(config);

    const _links = {
      self: data.payload._links.self
    };

    // fill in the missing links section
    filters.forEach((filterConfig: AdminNotifySearchFilterConfig) => {
      _links[filterConfig.name] = {
        href: filterConfig._links.self.href
      };
    });

    const facetConfigResponse = Object.assign(new FacetConfigResponse(), {
      filters,
      _links
    });

    this.addToObjectCache(facetConfigResponse, request, data);

    return new ParsedResponse(data.statusCode, facetConfigResponse._links.self);
  }
}
