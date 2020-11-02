import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { PaginatedList } from '../../../core/data/paginated-list';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { FindListOptions } from '../../../core/data/request.models';
import { hasValue } from '../../../shared/empty.util';
import { flatMap, map, take } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';

/**
 * This component represents the 'Import metadata from external source' dropdown menu
 */
@Component({
  selector: 'ds-my-dspace-new-external-dropdown',
  styleUrls: ['./my-dspace-new-external-dropdown.component.scss'],
  templateUrl: './my-dspace-new-external-dropdown.component.html'
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
  public initialized$: Observable<boolean>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {EntityTypeService} entityTypeService
   * @param {Router} router
   */
  constructor(private entityTypeService: EntityTypeService,
              private router: Router) { }

  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.initialized$ = observableOf(false);
    this.moreThanOne$ = this.entityTypeService.hasMoreThanOneAuthorizedImport();
    this.singleEntity$ = this.moreThanOne$.pipe(
      flatMap((response: boolean) => {
        if (!response) {
          const findListOptions: FindListOptions = {
            elementsPerPage: 1,
            currentPage: 1
          };
          return this.entityTypeService.getAllAuthorizedRelationshipTypeImport(findListOptions).pipe(
            map((entities: RemoteData<PaginatedList<ItemType>>) => {
              this.initialized$ = observableOf(true);
              return entities.payload.page[0];
            }),
            take(1)
          );
        } else {
          this.initialized$ = observableOf(true);
          return observableOf(null);
        }
      }),
      take(1)
    );
    this.subs.push(
      this.singleEntity$.subscribe((result) => this.singleEntity = result )
    );
  }

  /**
   * Method called on clicking the button 'Import metadata from external source'. It opens the page of the external import.
   */
  openPage(entity: ItemType) {
    this.router.navigate(['/import-external'], { queryParams: { entity: entity.label } });
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
