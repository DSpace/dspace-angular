import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatestWith, Observable, of, shareReplay, Subscription as rxSubscription } from 'rxjs';
import { combineLatest, map, switchMap, take, tap } from 'rxjs/operators';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { PageInfo } from '../core/shared/page-info.model';
import { AuthService } from '../core/auth/auth.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';

@Component({
  selector: 'ds-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit, OnDestroy {

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
   * Subscription to be unsubscribed
   */
  sub: rxSubscription;

  /**
   * A boolean representing if is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ePersonId$: Observable<string>;

  /**
   * EPerson id of the logged in user
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
      shareReplay(),
      /*tap((ePersonId: string) => { // TODO unused
        this.ePersonId = ePersonId;
      }),*/
    );
    const currentPagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      tap(console.log),
      combineLatestWith(this.ePersonId$),
      tap(() => {this.loading$.next(true);}),
      switchMap(([currentPagination, ePersonId]) => this.subscriptionService.findByEPerson(ePersonId,{
        currentPage: currentPagination.currentPage,
        elementsPerPage: currentPagination.pageSize
      })),
      tap((x) => console.log('find', x)),
      // getFirstSucceededRemoteDataPayload(),
    ).subscribe({
      next: (res: any) => {
        this.subscriptions$.next(res);
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
    /*this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      take(1),
      switchMap((findListOptions) => {
          this.loading$.next(true);
          return this.subscriptionService.findByEPerson(this.ePersonId,{
            currentPage: findListOptions.currentPage,
            elementsPerPage: findListOptions.pageSize
          });
        }
      )
    ).subscribe({
      next: (res: any) => {
        this.subscriptions$.next(res);
        this.loading$.next(false);
      },
      error: () => {
        this.loading$.next(false);
      }
    });*/
  }

  /**
   * Unsubscribe from pagination subscription
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  obs(v) {
    return of(v);
  }

}
