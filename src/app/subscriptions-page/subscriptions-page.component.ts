import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of as observableOf, BehaviorSubject, Subscription as rxSubscription } from 'rxjs';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { RemoteData } from '../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { Community } from '../core/shared/community.model';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { followLink, FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../core/data/request.models';
import { PaginationService } from '../core/pagination/pagination.service';
import { PageInfo } from '../core/shared/page-info.model';
import { AuthService } from '../core/auth/auth.service';
import { EPerson } from '../core/eperson/models/eperson.model';

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

  /**
   * EPerson id of the logged in user
   */
  eperson: string;

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
    this.authService.getAuthenticatedUserFromStore().pipe(take(1)).subscribe( (eperson: EPerson) => {
      this.eperson = eperson.id;

      this.sub = this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
        switchMap((findListOptions) => {
            this.loading$.next(true);
            return this.subscriptionService.findByEPerson(this.eperson,{
              currentPage: findListOptions.currentPage,
              elementsPerPage: findListOptions.pageSize
            });
          }
        )
      ).subscribe((res) => {
          this.subscriptions$.next(res);
          this.loading$.next(false);
        },
        (err) => {
          this.loading$.next(false);
        }
      );
    });
  }

  /**
   * When an action is made and the information is changed refresh the information
   */
  refresh(): void {
    this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      take(1),
      switchMap((findListOptions) => {
          this.loading$.next(true);
          return this.subscriptionService.findByEPerson(this.eperson,{
            currentPage: findListOptions.currentPage,
            elementsPerPage: findListOptions.pageSize
          });
        }
      )
    ).subscribe((res) => {
        this.subscriptions$.next(res);
        this.loading$.next(false);
      },
      (err) => {
        this.loading$.next(false);
      }
    );
  }

  /**
   * Unsubscribe from pagination subscription
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
