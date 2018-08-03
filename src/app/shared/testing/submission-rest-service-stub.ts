import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { RequestService } from '../../core/data/request.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Observable } from 'rxjs/Observable';

export class SubmissionRestServiceStub {
  protected linkPath = 'workspaceitems';
  protected responseCache: ResponseCacheService;
  protected requestService: RequestService;
  protected store: Store<CoreState>;
  protected halService: HALEndpointService;

  deleteById = jasmine.createSpy('deleteById');
  fetchRequest = jasmine.createSpy('fetchRequest');
  getDataById = jasmine.createSpy('getDataById');
  getDataByHref = jasmine.createSpy('getDataByHref');
  getEndpointByIDHref = jasmine.createSpy('getEndpointByIDHref');
  patchToEndpoint = jasmine.createSpy('patchToEndpoint');
  postToEndpoint = jasmine.createSpy('postToEndpoint').and.returnValue(Observable.of({}));
  submitData = jasmine.createSpy('submitData');
}
