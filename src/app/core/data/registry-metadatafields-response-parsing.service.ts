import {
  RegistryMetadatafieldsSuccessResponse,
  RestResponse
} from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { RestRequest } from './request.models';
import { ResponseParsingService } from './parsing.service';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { Injectable } from '@angular/core';
import { RegistryMetadatafieldsResponse } from '../registry/registry-metadatafields-response.model';

@Injectable()
export class RegistryMetadatafieldsResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const metadatafields = payload._embedded.metadatafields;
    metadatafields.forEach((field) => {
      field.schema = field._embedded.schema;
    });

    payload.metadatafields = metadatafields;

    const deserialized = new DSpaceRESTv2Serializer(RegistryMetadatafieldsResponse).deserialize(payload);
    return new RegistryMetadatafieldsSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(data.payload.page));
  }

}
