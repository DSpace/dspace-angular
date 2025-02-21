import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { CoreState } from '@dspace/core';
import { RequestService } from '../../data';
import { HALEndpointService } from '../../shared';

export class SubmissionRestServiceStub {
  protected linkPath = 'workspaceitems';
  protected requestService: RequestService;
  protected store: Store<CoreState>;
  protected halService: HALEndpointService;

  deleteById = jasmine.createSpy('deleteById');
  fetchRequest = jasmine.createSpy('fetchRequest');
  getDataById = jasmine.createSpy('getDataById');
  getDataByHref = jasmine.createSpy('getDataByHref');
  getEndpointByIDHref = jasmine.createSpy('getEndpointByIDHref');
  patchToEndpoint = jasmine.createSpy('patchToEndpoint');
  postToEndpoint = jasmine.createSpy('postToEndpoint').and.returnValue(observableOf({}));
  submitData = jasmine.createSpy('submitData');
}
