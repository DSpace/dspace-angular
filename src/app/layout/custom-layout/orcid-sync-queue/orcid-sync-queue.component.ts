import { Component, OnInit } from '@angular/core';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { LayoutBox } from '../../enums/layout-box.enum';
import { OrcidQueueService } from 'src/app/core/orcid/orcid-queue.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { OrcidQueue } from 'src/app/core/orcid/model/orcid-queue.model';
import { hasValue } from 'src/app/shared/empty.util';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { uniqueId } from 'lodash';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ds-orcid-sync-queue.component',
  templateUrl: './orcid-sync-queue.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.ORCID, LayoutBox.ORCID_SYNC_QUEUE)
export class OrcidSyncQueueComponent extends CrisLayoutBoxObj implements OnInit {

  /**
   * A list of orcid queue records
   */
  private list$: BehaviorSubject<RemoteData<PaginatedList<OrcidQueue>>> = new BehaviorSubject<RemoteData<PaginatedList<OrcidQueue>>>({} as any);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Pagination config used to display the list
   */
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();

  constructor(private orcidQueueService: OrcidQueueService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.paginationOptions.id = uniqueId('orcid-queue-list-pagination');
    this.paginationOptions.pageSize = 5;

    this.updateList();
  }

  updateList() {
    this.subs.push(this.orcidQueueService.searchByOwnerId(this.item.id, this.paginationOptions)
      .pipe(tap((x) => console.log('queue', x)))
      .subscribe((result) => this.list$.next(result)));
  }

  /**
   * Method called on page change
   */
  onPageChange(page: number): void {
    this.paginationOptions.currentPage = page;
    this.updateList();
  }

  /**
   * Return the list of orcid queue records
   */
  getList(): Observable<RemoteData<PaginatedList<OrcidQueue>>> {
    return this.list$.asObservable();
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.list$ = null;
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe())
  }
}
