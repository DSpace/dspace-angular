import { Injectable } from '@angular/core';
import { RegistrationSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { Registration } from '../shared/registration.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Parsing service responsible for parsing a Registration response
 */
export class RegistrationResponseParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const registration = Object.assign(new Registration(), payload);

    return new RegistrationSuccessResponse(registration, data.statusCode, data.statusText);
  }

}
