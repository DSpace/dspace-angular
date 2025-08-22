import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { redirectOn4xx } from '@dspace/core/shared/authorized.operators';
import { Item } from '@dspace/core/shared/item.model';
import { ItemRequest } from '@dspace/core/shared/item-request.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import {
  getRequestCopyDenyRoute,
  getRequestCopyGrantRoute,
} from '../request-copy-routing-paths';

@Component({
  selector: 'ds-grant-deny-request-copy',
  styleUrls: ['./grant-deny-request-copy.component.scss'],
  templateUrl: './grant-deny-request-copy.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
/**
 * Component for an author to decide to grant or deny an item request
 */
export class GrantDenyRequestCopyComponent implements OnInit {
  /**
   * The item request to grant or deny
   */
  itemRequestRD$: Observable<RemoteData<ItemRequest>>;

  /**
   * The item the request is requesting access to
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The name of the item
   */
  itemName$: Observable<string>;

  /**
   * The url of the item
   */
  itemUrl$: Observable<string>;

  /**
   * The route to the page for denying access to the item
   */
  denyRoute$: Observable<string>;

  /**
   * The route to the page for granting access to the item
   */
  grantRoute$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private itemDataService: ItemDataService,
    private nameService: DSONameService,
  ) {

  }

  ngOnInit(): void {
    this.itemRequestRD$ = this.route.data.pipe(
      map((data) => data.request as RemoteData<ItemRequest>),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
    );
    this.itemRD$ = this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((itemRequest: ItemRequest) => this.itemDataService.findById(itemRequest.itemId)),
    );
    this.itemName$ = this.itemRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item) => this.nameService.getName(item)),
    );
    this.itemUrl$ = this.itemRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item)),
    );

    this.denyRoute$ = this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((itemRequest: ItemRequest) => getRequestCopyDenyRoute(itemRequest.token)),
    );
    this.grantRoute$ = this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((itemRequest: ItemRequest) => getRequestCopyGrantRoute(itemRequest.token)),
    );
  }

}
