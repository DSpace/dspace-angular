import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { RemoteDataBuildService } from '../cache';
import { CoreState } from '../core-state.model';
import {
  RequestService,
  SubmissionPatchRequest,
} from '../data';
import { JsonPatchOperationsService } from '../json-patch';
import {
  HALEndpointService,
  SubmitDataResponseDefinitionObject,
} from '../shared';
import { URLCombiner } from '../url-combiner';

/**
 * A service that provides methods to make JSON Patch requests.
 */
@Injectable({ providedIn: 'root' })
export class SubmissionJsonPatchOperationsService extends JsonPatchOperationsService<SubmitDataResponseDefinitionObject, SubmissionPatchRequest> {
  protected linkPath = '';
  protected patchRequestConstructor = SubmissionPatchRequest;

  constructor(
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService) {

    super();
  }

  /**
   * Return an instance for RestRequest class
   *
   * @param uuid
   *    The request uuid
   * @param href
   *    The request href
   * @param body
   *    The request body
   * @return Object<PatchRequestDefinition>
   *    instance of PatchRequestDefinition
   */
  protected getRequestInstance(uuid: string, href: string, body?: any): SubmissionPatchRequest {
    return new this.patchRequestConstructor(uuid, new URLCombiner(href, '?embed=item').toString(), body);
  }

}
