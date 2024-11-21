import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  NavigationExtras,
  Router,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { ItemDataService } from '../core/data/item-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { Item } from '../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../core/shared/operators';
import { CrisLayoutComponent } from '../cris-layout/cris-layout.component';


@Component({
  selector: 'ds-item-detail-page-modal',
  templateUrl: './item-detail-page-modal.component.html',
  styleUrls: ['./item-detail-page-modal.component.scss'],
  imports: [
    CrisLayoutComponent,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true,
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
              private router: Router,
  ) {
  }


  /**
   * When component starts initialize starting functionality
   */
  ngOnInit(): void {
    this.itemRD$ = this.itemService.findById(this.uuid).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
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
        true,
      ).pipe(
        getFirstCompletedRemoteData(),
      ),
      ));
  }

  /**
   * When close button is pressed emit function to close modal
   */
  dismiss(text): void {
    const navExtras: NavigationExtras = {
      queryParams: null,
    };
    this.router.navigate([], navExtras);
    this.close.emit(text);
    this.modalService.dismissAll();
  }
}
