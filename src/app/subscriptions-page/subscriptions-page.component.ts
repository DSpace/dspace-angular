import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { RemoteData } from '../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { Community } from '../core/shared/community.model';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { followLink, FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../core/data/request.models';

@Component({
  selector: 'ds-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit {

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  subscriptions$: Observable<PaginatedList<Subscription>>;

  /**
   * The current pagination configuration for the page used by the FindAll method
   * Currently simply renders all bitstream formats
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 2
  });

  /**
   * The current pagination configuration for the page
   * Currently simply renders all bitstream formats
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'rbp',
    pageSize: 2
  });


  constructor(
    private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {

    this.subscriptions$ = this.getSubscriptions() as Observable<PaginatedList<Subscription>>;

  }

  getSubscriptions(): Observable<PaginatedList<Subscription>> {
    return this.subscriptionService.findAllSubscriptions().pipe(
      tap((res) => {console.log(res)})
    );
  }

  refresh(){
    
  }

}
