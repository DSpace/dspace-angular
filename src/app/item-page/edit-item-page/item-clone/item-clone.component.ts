import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { Item } from '../../../core/shared/item.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { SearchService } from '../../../core/shared/search/search.service';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { AuthorizedCollectionSelectorComponent } from '../../../shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { getItemPageRoute } from '../../item-page-routing-paths';

@Component({
  selector: 'ds-item-clone',
  templateUrl: './item-clone.component.html',
  imports: [
    AsyncPipe,
    AuthorizedCollectionSelectorComponent,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbTooltipModule,
    RouterLink,
  ],
  standalone: true,
})
export class ItemCloneComponent implements OnInit {
  /**
   * TODO: Similarly to {@code ItemMoveComponent}, there is currently no backend support to change the
   * owningCollection and inherit policies, hence the code that was commented out
   */

  selectorType = DSpaceObjectType.COLLECTION;

  inheritPolicies = false;
  itemRD$: Observable<RemoteData<Item>>;
  originalCollection: Collection;

  selectedCollectionName: string;
  selectedCollection: Collection;
  canSubmit = false;

  item: Item;
  processing = false;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  COLLECTIONS = [DSpaceObjectType.COLLECTION];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService,
              private workspaceItemDataService: WorkspaceitemDataService,
              private searchService: SearchService,
              private translateService: TranslateService,
              private requestService: RequestService,
              protected dsoNameService: DSONameService,
  ) {}

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso), getFirstSucceededRemoteData(),
    ) as Observable<RemoteData<Item>>;
    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item)),
    );
    this.itemRD$.subscribe((rd) => {
      this.item = rd.payload;
    },
    );
    this.itemRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((item) => item.owningCollection),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((collection) => {
      this.originalCollection = collection;
    });
  }

  /**
   * Set the collection name and id based on the selected value
   * @param data - obtained from the ds-input-suggestions component
   */
  selectDso(data: any): void {
    this.selectedCollection = data;
    this.selectedCollectionName = this.dsoNameService.getName(data);
    this.canSubmit = true;
  }

  /**
   * @returns {string} the current URL
   */
  getCurrentUrl() {
    return this.router.url;
  }

  /**
   * Clones the item, saving it to a new collection based on the selected collection
   */
  cloneToCollection() {
    this.processing = true;
    const clone$ = this.workspaceItemDataService.cloneToCollection(this.item._links.self.href, this.selectedCollection.id)
      .pipe(getFirstCompletedRemoteData());

    clone$.subscribe((response: RemoteData<any>) => {
      if (response.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('item.edit.clone.success'));
      } else {
        this.notificationsService.error(this.translateService.get('item.edit.clone.error'));
      }
    });

    clone$.pipe(
      getFirstSucceededRemoteDataPayload<WorkspaceItem>())
      .subscribe((wsi) => {
        this.processing = false;
        this.router.navigate(['/workspaceitems', wsi.id, 'edit']);
      });

  }

  discard(): void {
    this.selectedCollection = null;
    this.canSubmit = false;
  }

  get canClone(): boolean {
    return this.canSubmit;
  }
}
