import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatestWith,
  Observable,
  shareReplay,
  Subscription as rxjsSubscription,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import {
  buildPaginatedList,
  PaginatedList,
} from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { EPerson } from '../core/eperson/models/eperson.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { getAllCompletedRemoteData } from '../core/shared/operators';
import { PageInfo } from '../core/shared/page-info.model';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertType } from '../shared/alert/alert-type';
import { hasValue } from '../shared/empty.util';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { SubscriptionViewComponent } from '../shared/subscriptions/subscription-view/subscription-view.component';
import { SubscriptionsDataService } from '../shared/subscriptions/subscriptions-data.service';
import { VarDirective } from '../shared/utils/var.directive';

@Component({
  selector: 'ds-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss'],
  standalone: true,
  imports: [NgIf, ThemedLoadingComponent, VarDirective, PaginationComponent, NgFor, SubscriptionViewComponent, AlertComponent, AsyncPipe, TranslateModule],
})
/**
 * List and allow to manage all the active subscription for the current user
 */
export class SubscriptionsPageComponent implements OnInit, OnDestroy {

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  subscriptions$: BehaviorSubject<PaginatedList<Subscription>> = new BehaviorSubject(buildPaginatedList<Subscription>(new PageInfo(), []));

  /**
   * The current pagination configuration for the page
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'elp',
    pageSize: 10,
    currentPage: 1,
  });

  /**
   * A boolean representing if is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The current eperson id
   */
  ePersonId$: Observable<string>;

  /**
   * The rxjs subscription used to retrieve the result list
   */
  sub: rxjsSubscription = null;

  readonly AlertType = AlertType;

  constructor(
    private paginationService: PaginationService,
    private authService: AuthService,
    private subscriptionService: SubscriptionsDataService,
  ) {

  }

  /**
   * Retrieve the current eperson id and call method to retrieve the subscriptions
   */
  ngOnInit(): void {
    this.ePersonId$ = this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      map((ePerson: EPerson) => ePerson.id),
      shareReplay({ refCount: false }),
    );
    this.retrieveSubscriptions();
  }

  /**
   * Retrieve subscription list related to the current user.
   * When page is changed it will request the new subscriptions for the new page config
   * @private
   */
  private retrieveSubscriptions(): void {
    this.sub = this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      combineLatestWith(this.ePersonId$),
      tap(() => this.loading$.next(true)),
      switchMap(([currentPagination, ePersonId]) => this.subscriptionService.findByEPerson(ePersonId,{
        currentPage: currentPagination.currentPage,
        elementsPerPage: currentPagination.pageSize,
      })),
      getAllCompletedRemoteData(),
    ).subscribe((res: RemoteData<PaginatedList<Subscription>>) => {
      if (res.hasSucceeded) {
        this.subscriptions$.next(res.payload);
      }
      this.loading$.next(false);
    });
  }
  /**
   * When a subscription is deleted refresh the subscription list
   */
  refresh(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }

    this.retrieveSubscriptions();
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
