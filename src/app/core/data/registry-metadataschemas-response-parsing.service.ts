import { RegistryMetadataschemasSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { RestRequest } from './request.models';
import { ResponseParsingService } from './parsing.service';
import { RegistryMetadataschemasResponse } from '../registry/registry-metadataschemas-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';

@Injectable()
export class RegistryMetadataschemasResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    let metadataschemas = [];
    if (hasValue(payload._embedded)) {
      metadataschemas = payload._embedded.metadataschemas;
    }
    payload.metadataschemas = metadataschemas;

    const deserialized = new DSpaceRESTv2Serializer(RegistryMetadataschemasResponse).deserialize(payload);
    return new RegistryMetadataschemasSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(data.payload));
  }

}
