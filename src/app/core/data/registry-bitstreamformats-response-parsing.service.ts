import { Injectable } from '@angular/core';
import { RegistryBitstreamformatsSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { RegistryBitstreamformatsResponse } from '../registry/registry-bitstreamformats-response.model';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class RegistryBitstreamformatsResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const bitstreamformats = payload._embedded.bitstreamformats;
    payload.bitstreamformats = bitstreamformats;

    const deserialized = new DSpaceSerializer(RegistryBitstreamformatsResponse).deserialize(payload);
    return new RegistryBitstreamformatsSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(data.payload.page));
  }

}
