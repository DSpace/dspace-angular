import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatestWith, Observable, shareReplay } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { PageInfo } from '../core/shared/page-info.model';
import { AuthService } from '../core/auth/auth.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { RemoteData } from '../core/data/remote-data';

@Component({
  selector: 'ds-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit {

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  subscriptions$: BehaviorSubject<PaginatedList<Subscription>> = new BehaviorSubject(buildPaginatedList<Subscription>(new PageInfo(), []));

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
   * A boolean representing if is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ePersonId$: Observable<string>;

  /**
   * EPerson id of the logged-in user
   */
  // ePersonId: string;

  constructor(
    private paginationService: PaginationService,
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) { }

  /**
   * Subscribe the pagination service to send a request with specific pagination
   * When page is changed it will request the new subscriptions for the new page config
   */
  ngOnInit(): void {
    this.ePersonId$ = this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      map((ePerson: EPerson) => ePerson.id),
      shareReplay()
    );
    this.retrieveSubscriptions();
  }

  private retrieveSubscriptions() {
    this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      combineLatestWith(this.ePersonId$),
      tap(() => this.loading$.next(true)),
      switchMap(([currentPagination, ePersonId]) => this.subscriptionService.findByEPerson(ePersonId,{
        currentPage: currentPagination.currentPage,
        elementsPerPage: currentPagination.pageSize
      })),
      getFirstCompletedRemoteData()

    ).subscribe((res: RemoteData<PaginatedList<Subscription>>) => {
      if (res.hasSucceeded) {
        this.subscriptions$.next(res.payload);
      }
      this.loading$.next(false);
    });
  }
  /**
   * When an action is made and the information is changed refresh the information
   */
  refresh(): void {
    this.retrieveSubscriptions();
  }

}
