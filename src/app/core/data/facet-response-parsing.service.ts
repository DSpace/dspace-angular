import { Injectable } from '@angular/core';
import {
  FacetValueMap,
  FacetValueMapSuccessResponse,
  FacetValueSuccessResponse,
  RestResponse
} from '../cache/response-cache.models';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { PageInfo } from '../shared/page-info.model';
import { isNotEmpty } from '../../shared/empty.util';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';

@Injectable()
export class FacetResponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {

    const payload = data.payload;
    const facetMap: FacetValueMap = new FacetValueMap();

    const serializer = new DSpaceRESTv2Serializer(FacetValue);
    payload._embedded.facets.map((facet) => {
      const values = facet._embedded.values.map((value) => {value.search = value._links.search.href; return value;});
      const facetValues = serializer.deserializeArray(values);
      const valuesResponse = new FacetValueSuccessResponse(facetValues, data.statusCode, this.processPageInfo(data.payload.page));
      facetMap[facet.name] = valuesResponse;
    });

    return new FacetValueMapSuccessResponse(facetMap, data.statusCode);
  }

  protected processPageInfo(pageObj: any): PageInfo {
    if (isNotEmpty(pageObj)) {
      return new DSpaceRESTv2Serializer(PageInfo).deserialize(pageObj);
    } else {
      return undefined;
    }
  }
}
