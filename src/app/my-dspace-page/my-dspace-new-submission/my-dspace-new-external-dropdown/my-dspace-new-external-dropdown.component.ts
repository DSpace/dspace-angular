import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
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
import { hasValue } from '../../../shared/empty.util';
import { EntityDropdownComponent } from '../../../shared/entity-dropdown/entity-dropdown.component';
import { BrowserOnlyPipe } from '../../../shared/utils/browser-only.pipe';

/**
 * This component represents the 'Import metadata from external source' dropdown menu
 */
@Component({
  selector: 'ds-my-dspace-new-external-dropdown',
  styleUrls: ['./my-dspace-new-external-dropdown.component.scss'],
  templateUrl: './my-dspace-new-external-dropdown.component.html',
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
export class MyDSpaceNewExternalDropdownComponent implements OnInit, OnDestroy {

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
  public initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {EntityTypeDataService} entityTypeService
   * @param {Router} router
   */
  constructor(private entityTypeService: EntityTypeDataService,
              private router: Router) { }

  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.moreThanOne$ = this.entityTypeService.hasMoreThanOneAuthorizedImport();
    this.singleEntity$ = this.moreThanOne$.pipe(
      mergeMap((response: boolean) => {
        if (!response) {
          const findListOptions: FindListOptions = {
            elementsPerPage: 1,
            currentPage: 1,
          };
          return this.entityTypeService.getAllAuthorizedRelationshipTypeImport(findListOptions).pipe(
            take(1),
            map((entities: RemoteData<PaginatedList<ItemType>>) => {
              this.initialized$.next(true);
              return entities?.payload?.page[0];
            }),
          );
        } else {
          this.initialized$.next(true);
          return of(null);
        }
      }),
      take(1),
    );
    this.subs.push(
      this.singleEntity$.subscribe((result) => {
        this.singleEntity = result;
      } ),
    );
  }

  /**
   * Method called on clicking the button 'Import metadata from external source'. It opens the page of the external import.
   */
  openPage(entity: ItemType) {
    const params = Object.create({});
    if (entity) {
      params.entity = entity.label;
    }
    this.router.navigate(['/import-external'], { queryParams: params });
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
