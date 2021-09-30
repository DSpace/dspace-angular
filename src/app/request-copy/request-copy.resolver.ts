import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { ItemRequest } from '../core/shared/item-request.model';
import { Observable } from 'rxjs/internal/Observable';
import { ItemRequestDataService } from '../core/data/item-request-data.service';

export class RequestCopyResolver implements Resolve<RemoteData<ItemRequest>> {

  constructor(
    private itemRequestDataService: ItemRequestDataService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<ItemRequest>> | Promise<RemoteData<ItemRequest>> | RemoteData<ItemRequest> {
    // TODO add method after knowing whether they will change the rest object to be compatible with normal dataservice.
    return undefined;
  }

}