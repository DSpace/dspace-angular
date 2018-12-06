import { Injectable } from '@angular/core';

import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { RegistryMetadataschemasSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { RegistryMetadataschemasResponse } from '../registry/registry-metadataschemas-response.model';

@Injectable()
export class RegistryMetadataschemasResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const metadataschemas = payload._embedded.metadataschemas;
    payload.metadataschemas = metadataschemas;

    const deserialized = new DSpaceRESTv2Serializer(RegistryMetadataschemasResponse).deserialize(payload);
    return new RegistryMetadataschemasSuccessResponse(deserialized, data.statusCode, this.dsoParser.processPageInfo(data.payload.page));
  }

}
