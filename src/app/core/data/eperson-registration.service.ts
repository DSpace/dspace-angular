import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { GetRequest, PostRequest } from './request.models';
import { Observable } from 'rxjs';
import { filter, find, map, take } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Registration } from '../shared/registration.model';
import { filterSuccessfulResponses, getResponseFromEntry } from '../shared/operators';
import { ResponseParsingService } from './parsing.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { RegistrationResponseParsingService } from './registration-response-parsing.service';
import { RegistrationSuccessResponse } from '../cache/response.models';

@Injectable(
  {
    providedIn: 'root',
  }
)
/**
 * Service that will register a new email address and request a token
 */
export class EpersonRegistrationService {

  protected linkPath = 'registrations';
  protected searchByTokenPath = '/search/findByToken?token=';

  constructor(
    protected requestService: RequestService,
    protected halService: HALEndpointService,
  ) {

  }

  /**
   * Retrieves the Registration endpoint
   */
  getRegistrationEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Retrieves the endpoint to search by registration token
   */
  getTokenSearchEndpoint(token: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}${this.searchByTokenPath}${token}`));
  }

  /**
   * Register a new email address
   * @param email
   */
  registerEmail(email: string) {
    const registration = new Registration();
    registration.email = email;

    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.getRegistrationEndpoint();

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, registration);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
  }

  /**
   * Search a registration based on the provided token
   * @param token
   */
  searchByToken(token: string): Observable<Registration> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.getTokenSearchEndpoint(token);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new GetRequest(requestId, href);
        const parser = Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return RegistrationResponseParsingService;
          }
        });
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      filterSuccessfulResponses(),
      map((restResponse: RegistrationSuccessResponse) => {
        return Object.assign(new Registration(), {email: restResponse.registration.email, token: token, user: restResponse.registration.user});
      }),
      take(1),
    );

  }

}
