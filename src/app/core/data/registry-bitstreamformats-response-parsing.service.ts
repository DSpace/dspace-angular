import { Injectable } from '@angular/core';

import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { RegistryBitstreamformatsSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { RegistryBitstreamformatsResponse } from '../registry/registry-bitstreamformats-response.model';

@Injectable()
export class RegistryBitstreamformatsResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const bitstreamformats = payload._embedded.bitstreamformats;
    payload.bitstreamformats = bitstreamformats;

    const deserialized = new DSpaceRESTv2Serializer(RegistryBitstreamformatsResponse).deserialize(payload);
    return new RegistryBitstreamformatsSuccessResponse(deserialized, data.statusCode, this.dsoParser.processPageInfo(data.payload.page));
  }

}
