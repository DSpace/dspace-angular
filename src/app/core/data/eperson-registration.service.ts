import {
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import {
  filter,
  find,
  map,
} from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NoContent } from '../shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { Registration } from '../shared/registration.model';
import { ResponseParsingService } from './parsing.service';
import { RegistrationResponseParsingService } from './registration-response-parsing.service';
import { RemoteData } from './remote-data';
import {
  GetRequest,
  PatchRequest,
  PostRequest,
} from './request.models';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service that will register a new email address and request a token
 */
export class EpersonRegistrationService {

  protected linkPath = 'registrations';
  protected searchByTokenPath = '/search/findByToken?token=';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
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
   * @param captchaToken the value of x-captcha-payload header
   */
  registerEmail(email: string, captchaToken: string = null, type?: string): Observable<RemoteData<Registration>> {
    const registration = new Registration();
    registration.email = email;

    const requestId = this.requestService.generateRequestId();

    const href$ = this.getRegistrationEndpoint();

    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    if (captchaToken) {
      headers = headers.append('x-captcha-payload', captchaToken);
    }
    options.headers = headers;

    if (hasValue(type)) {
      options.params = type ?
        new HttpParams({ fromString: 'accountRequestType=' + type }) : new HttpParams();
    }

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, registration, options);
        this.requestService.send(request);
      }),
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<Registration>(requestId).pipe(
      getFirstCompletedRemoteData(),
    );
  }

  /**
   * Searches for a registration based on the provided token.
   * @param token The token to search for.
   * @returns An observable of remote data containing the registration.
   */
  searchByTokenAndUpdateData(token: string): Observable<RemoteData<Registration>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getTokenSearchEndpoint(token).pipe(
      find((href: string) => hasValue(href)),
    );

    href$.subscribe((href: string) => {
      const request = new GetRequest(requestId, href);
      Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return RegistrationResponseParsingService;
        },
      });
      this.requestService.send(request, true);
    });

    return this.rdbService.buildSingle<Registration>(href$).pipe(
      map((rd) => {
        if (rd.hasSucceeded && hasValue(rd.payload)) {
          return Object.assign(rd, { payload: Object.assign(new Registration(), {
            email: rd.payload.email,
            token: token,
            user: rd.payload.user,
          }) });
        } else {
          return rd;
        }
      }),
    );
  }

  /**
   * Searches for a registration by token and handles any errors that may occur.
   * @param token The token to search for.
   * @returns An observable of remote data containing the registration.
   */
  searchByTokenAndHandleError(token: string): Observable<RemoteData<Registration>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getTokenSearchEndpoint(token).pipe(
      find((href: string) => hasValue(href)),
    );

    href$.subscribe((href: string) => {
      const request = new GetRequest(requestId, href);
      Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return RegistrationResponseParsingService;
        },
      });
      this.requestService.send(request, true);
    });
    return this.rdbService.buildSingle<Registration>(href$);
  }

  /**
   * Patch the registration object to update the email address
   * @param value provided by the user during the registration confirmation process
   * @param registrationId The id of the registration object
   * @param token The token of the registration object
   * @param updateValue Flag to indicate if the email should be updated or added
   * @returns Remote Data state of the patch request
   */
  patchUpdateRegistration(values: string[], field: string, registrationId: string, token: string, operator: 'add' | 'replace'): Observable<RemoteData<NoContent>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getRegistrationEndpoint().pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => `${href}/${registrationId}?token=${token}`),
    );

    href$.subscribe((href: string) => {
      const operations = this.generateOperations(values, field, operator);
      const patchRequest = new PatchRequest(requestId, href, operations);
      this.requestService.send(patchRequest);
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Custom method to generate the operations to be performed on the registration object
   * @param value provided by the user during the registration confirmation process
   * @param updateValue Flag to indicate if the email should be updated or added
   * @returns Operations to be performed on the registration object
   */
  private generateOperations(values: string[], field: string, operator: 'add' | 'replace'): Operation[] {
    let operations = [];
    if (values.length > 0 && hasValue(field) ) {
      operations = [{
        op: operator, path: `/${field}`, value: values,
      }];
    }

    return operations;
  }
}
