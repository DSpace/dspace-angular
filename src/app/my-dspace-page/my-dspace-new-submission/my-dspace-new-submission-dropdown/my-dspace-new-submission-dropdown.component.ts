import { AsyncPipe } from '@angular/common';
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
  of,
  Subscription,
} from 'rxjs';
import {
  map,
  mergeMap,
  take,
} from 'rxjs/operators';

import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { ThemedCreateItemParentSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import { hasValue } from '../../../shared/empty.util';
import { EntityDropdownComponent } from '../../../shared/entity-dropdown/entity-dropdown.component';
import { BrowserOnlyPipe } from '../../../shared/utils/browser-only.pipe';

/**
 * This component represents the new submission dropdown
 */
@Component({
  selector: 'ds-my-dspace-new-submission-dropdown',
  styleUrls: ['./my-dspace-new-submission-dropdown.component.scss'],
  templateUrl: './my-dspace-new-submission-dropdown.component.html',
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    BtnDisabledDirective,
    EntityDropdownComponent,
    NgbDropdownModule,
    TranslateModule,
  ],
  standalone: true,
})
export class MyDSpaceNewSubmissionDropdownComponent implements OnInit, OnDestroy {

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

  /**
   * Initialize instance variables
   *
   * @param {EntityTypeDataService} entityTypeService
   * @param {NgbModal} modalService
   */
  constructor(private entityTypeService: EntityTypeDataService,
              private modalService: NgbModal) { }

  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.initialized$ = of(false);
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
              this.initialized$ = of(true);
              return entities.payload.page[0];
            }),
            take(1),
          );
        } else {
          this.initialized$ = of(true);
          return of(null);
        }
      }),
      take(1),
    );
    this.subs.push(
      this.singleEntity$.subscribe((result) => this.singleEntity = result ),
    );
  }

  /**
   * Method called on clicking the button "New Submission", It opens a dialog for
   * select a collection.
   */
  openDialog(entity: ItemType) {
    const modalRef = this.modalService.open(ThemedCreateItemParentSelectorComponent);
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
