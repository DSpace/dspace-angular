import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { CoreState } from '../../core/core-state.model';
import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';

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
  postToEndpoint = jasmine.createSpy('postToEndpoint').and.returnValue(of({}));
  submitData = jasmine.createSpy('submitData');
}
