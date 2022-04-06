import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { ItemDataService } from '../core/data/item-data.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../core/shared/operators';
import { NavigationExtras, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { TabDataService } from '../core/layout/tab-data.service';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { PaginatedList } from '../core/data/paginated-list.model';


@Component({
  selector: 'ds-item-detail-page-modal',
  templateUrl: './item-detail-page-modal.component.html',
  styleUrls: ['./item-detail-page-modal.component.scss']
})
export class ItemDetailPageModalComponent implements OnInit {


  /**
   * UUID of which to get item
   */
  @Input() uuid: string;

  /**
   * DSpace dataTabs passed as Input for specific item
   */
  dataTabs$: Observable<RemoteData<PaginatedList<CrisLayoutTab>>>;

  /**
   * Close event emit to close modal
   */
  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  itemRD$: Observable<Item>;

  constructor(private itemService: ItemDataService,
              private modalService: NgbModal,
              private tabService: TabDataService,
              private router: Router
  ) {
  }


  /**
   * When component starts initialize starting functionality
   */
  ngOnInit(): void {
    this.itemRD$ = this.itemService.findById(this.uuid).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
    this.dataTabs$ = this.getTabsFromItemId();
  }

  /**
   * Passing the tabs as input
   */
  getTabsFromItemId() {
    return this.itemService.findById(this.uuid).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((item: Item) => {
        if (!item || (!!item && !item.uuid)) {
          this.router.navigate(['/404']);
        }
        return item;
      }),
      switchMap((item: Item) => this.tabService.findByItem(
          item.uuid, // Item UUID
          true
        ).pipe(
          getFirstCompletedRemoteData(),
        )
      ));
  }

  /**
   * When close button is pressed emit function to close modal
   */
  dismiss(text): void {
    const navExtras: NavigationExtras = {
      queryParams: null
    };
    this.router.navigate([], navExtras);
    this.close.emit(text);
    this.modalService.dismissAll();
  }
}
