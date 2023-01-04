import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription as rxSubscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { PaginatedList } from '../core/data/paginated-list.model';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { AuthService } from '../core/auth/auth.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { RemoteData } from '../core/data/remote-data';
import { hasValue } from '../shared/empty.util';

@Component({
  selector: 'ds-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit, OnDestroy {

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  subscriptions$: BehaviorSubject<PaginatedList<Subscription>> = new BehaviorSubject(null);

  /**
   * The current pagination configuration for the page used by the FindAll method
   * Currently simply renders subscriptions
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'elp',
    pageSize: 10,
    currentPage: 1
  });

  /**
   * Subscription to be unsubscribed
   */
  sub: rxSubscription;

  /**
   * A boolean representing if is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * EPerson id of the logged in user
   */
  eperson: string;

  constructor(
    private paginationService: PaginationService,
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) {
  }

  /**
   * Subscribe the pagination service to send a request with specific pagination
   * When page is changed it will request the new subscriptions for the new page config
   */
  ngOnInit(): void {
    this.loading$.next(true);
    this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      tap((eperson: EPerson) => {
        this.eperson = eperson.id;
      }),
      switchMap(() => this.retrieveSubscriptions())
    ).subscribe({
      next: (res: RemoteData<PaginatedList<Subscription>>) => {
        if (res.hasSucceeded) {
          this.subscriptions$.next(res.payload);
        }
        this.loading$.next(false);
      },
      error: () => {
        this.loading$.next(false);
      }
    });
  }

  /**
   * When an action is made and the information is changed refresh the information
   */
  refresh(): void {
    this.loading$.next(true);
    this.retrieveSubscriptions().subscribe({
      next: (res: any) => {
        if (res.hasSucceeded) {
          this.subscriptions$.next(res.payload);
        }
        this.loading$.next(false);
      },
      error: () => {
        this.loading$.next(false);
      }
    });
  }

  private retrieveSubscriptions(): Observable<RemoteData<PaginatedList<Subscription>>> {
    return this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      switchMap((findListOptions) => {
          return this.subscriptionService.findByEPerson(this.eperson, {
            currentPage: findListOptions.currentPage,
            elementsPerPage: findListOptions.pageSize
          });
        }
      ),
      getFirstCompletedRemoteData()
    );
  }

  /**
   * Unsubscribe from pagination subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
