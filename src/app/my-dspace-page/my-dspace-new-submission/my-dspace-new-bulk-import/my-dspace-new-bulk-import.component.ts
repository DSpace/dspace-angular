import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  map,
  mergeMap,
  take,
} from 'rxjs/operators';
import { BtnDisabledDirective } from 'src/app/shared/btn-disabled.directive';

import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { BulkImportSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/bulk-import-collection-selector/bulk-import-collection-selector.component';
import { hasValue } from '../../../shared/empty.util';
import { EntityDropdownComponent } from '../../../shared/entity-dropdown/entity-dropdown.component';


/**
 * This component represents the 'Import metadata from external source' dropdown menu
 */
@Component({
  selector: 'ds-my-dspace-new-bulk-import',
  templateUrl: './my-dspace-new-bulk-import.component.html',
  imports: [
    AsyncPipe,
    NgIf,
    TranslateModule,
    NgbDropdownModule,
    EntityDropdownComponent,
    BtnDisabledDirective,
  ],
  standalone: true,
})
export class MyDSpaceNewBulkImportComponent implements OnInit, OnDestroy {

  /**
   * Used to verify if there are one or more entities available
   */
  public moreThanOne$: Observable<boolean>;

  /**
   * The entity observble (only if there is only one entity available)
   */
  public singleEntity$: Observable<ItemType>;

  /**
   * The entity object (only if there is only one entity available)
   */
  public singleEntity: ItemType;

  /**
   * TRUE if the page is initialized
   */
  public initialized$: Observable<boolean>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  constructor(private modalService: NgbModal,private entityTypeService: EntityTypeDataService) { }


  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.initialized$ = observableOf(false);
    this.moreThanOne$ = this.entityTypeService.hasMoreThanOneAuthorized();
    this.singleEntity$ = this.moreThanOne$.pipe(
      mergeMap((response: boolean) => {
        if (!response) {
          const findListOptions: FindListOptions = {
            elementsPerPage: 1,
            currentPage: 1,
          };
          return this.entityTypeService.getAllAuthorizedRelationshipType(findListOptions).pipe(
            map((entities: RemoteData<PaginatedList<ItemType>>) => {
              this.initialized$ = observableOf(true);
              return entities.payload.page[0];
            }),
            take(1),
          );
        } else {
          this.initialized$ = observableOf(true);
          return observableOf(null);
        }
      }),
      take(1),
    );
    this.subs.push(
      this.singleEntity$.subscribe((result) => this.singleEntity = result ),
    );
  }

  /**
   * Method called on clicking the button "Bulk Import", It opens a dialog for
   * select a collection.
   */
  openDialog(entity: ItemType) {
    const modalRef = this.modalService.open(BulkImportSelectorComponent);
    modalRef.componentInstance.entityType = entity.label;
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
