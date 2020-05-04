import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription, zip as observableZip } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue } from '../../../../empty.util';
import { map, skip, switchMap, take } from 'rxjs/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../../object-list/selectable-list/selectable-list.reducer';
import { ListableObject } from '../../../../object-collection/shared/listable-object.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { SearchResult } from '../../../../search/search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload,
  getSucceededRemoteData
} from '../../../../../core/shared/operators';
import { AddRelationshipAction, RemoveRelationshipAction, UpdateRelationshipAction } from './relationship.actions';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { Context } from '../../../../../core/shared/context.model';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { LookupRelationService } from '../../../../../core/data/lookup-relation.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { ExternalSource } from '../../../../../core/shared/external-source.model';
import { ExternalSourceService } from '../../../../../core/data/external-source.service';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  templateUrl: './dynamic-lookup-relation-modal.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

/**
 * Represents a modal where the submitter can select items to be added as a certain relationship type to the object being submitted
 */
export class DsDynamicLookupRelationModalComponent implements OnInit, OnDestroy {
  /**
   * The label to use to display i18n messages (describing the type of relationship)
   */
  label: string;

  /**
   * Options for searching related items
   */
  relationshipOptions: RelationshipOptions;

  /**
   * The ID of the list to add/remove selected items to/from
   */
  listId: string;

  /**
   * The item we're adding relationships to
   */
  item;

  /**
   * The collection we're submitting an item to
   */
  collection;

  /**
   * Is the selection repeatable?
   */
  repeatable: boolean;

  /**
   * The list of selected items
   */
  selection$: Observable<ListableObject[]>;

  /**
   * The context to display lists
   */
  context: Context;

  /**
   * The metadata-fields describing these relationships
   */
  metadataFields: string;

  /**
   * A map of subscriptions within this component
   */
  subMap: {
    [uuid: string]: Subscription
  } = {};

  /**
   * A list of the available external sources configured for this relationship
   */
  externalSourcesRD$: Observable<RemoteData<PaginatedList<ExternalSource>>>;

  /**
   * The total amount of internal items for the current options
   */
  totalInternal$: Observable<number>;

  /**
   * The total amount of results for each external source using the current options
   */
  totalExternal$: Observable<number[]>;

  constructor(
    public modal: NgbActiveModal,
    private selectableListService: SelectableListService,
    private relationshipService: RelationshipService,
    private relationshipTypeService: RelationshipTypeService,
    private externalSourceService: ExternalSourceService,
    private lookupRelationService: LookupRelationService,
    private searchConfigService: SearchConfigurationService,
    private zone: NgZone,
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.selection$ = this.selectableListService
      .getSelectableList(this.listId)
      .pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
    this.selection$.pipe(take(1)).subscribe((selection) =>
      selection.map((s: SearchResult<Item>) => this.addNameVariantSubscription(s))
    );
    if (this.relationshipOptions.nameVariants) {
      this.context = Context.SubmissionModal;
    }

    this.externalSourcesRD$ = this.externalSourceService.findAll();

    this.setTotals();
  }

  close() {
    this.modal.close();
  }

  /**
   * Select (a list of) objects and add them to the store
   * @param selectableObjects
   */
  select(...selectableObjects: Array<SearchResult<Item>>) {
    this.zone.runOutsideAngular(
      () => {
        const obs: Observable<any[]> = combineLatest(...selectableObjects.map((sri: SearchResult<Item>) => {
            this.addNameVariantSubscription(sri);
            return this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid)
              .pipe(
                take(1),
                map((nameVariant: string) => {
                  return {
                    item: sri.indexableObject,
                    nameVariant
                  }
                })
              )
          })
        );
        obs
          .subscribe((arr: any[]) => {
            return arr.forEach((object: any) => {
                this.store.dispatch(new AddRelationshipAction(this.item, object.item, this.relationshipOptions.relationshipType, object.nameVariant));
              }
            );
          })
      });
  }

  /**
   * Add a subscription updating relationships with name variants
   * @param sri The search result to track name variants for
   */
  private addNameVariantSubscription(sri: SearchResult<Item>) {
    const nameVariant$ = this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid);
    this.subMap[sri.indexableObject.uuid] = nameVariant$.pipe(
      skip(1),
    ).subscribe((nameVariant: string) => this.store.dispatch(new UpdateRelationshipAction(this.item, sri.indexableObject, this.relationshipOptions.relationshipType, nameVariant)))
  }

  /**
   * Deselect (a list of) objects and remove them from the store
   * @param selectableObjects
   */
  deselect(...selectableObjects: Array<SearchResult<Item>>) {
    this.zone.runOutsideAngular(
      () => selectableObjects.forEach((object) => {
        this.subMap[object.indexableObject.uuid].unsubscribe();
        this.store.dispatch(new RemoveRelationshipAction(this.item, object.indexableObject, this.relationshipOptions.relationshipType));
      })
    );
  }

  /**
   * Set existing name variants for items by the item's virtual metadata
   */
  private setExistingNameVariants() {
    const virtualMDs: MetadataValue[] = this.item.allMetadata(this.metadataFields).filter((mdValue) => mdValue.isVirtual);

    const relatedItemPairs$: Observable<Array<[Item, Item]>> =
      combineLatest(virtualMDs.map((md: MetadataValue) => this.relationshipService.findById(md.virtualValue).pipe(getSucceededRemoteData(), getRemoteDataPayload())))
        .pipe(
          switchMap((relationships: Relationship[]) => combineLatest(relationships.map((relationship: Relationship) =>
              combineLatest(
                relationship.leftItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()),
                relationship.rightItem.pipe(getSucceededRemoteData(), getRemoteDataPayload())
              ))
            )
          )
        );

    const relatedItems$: Observable<Item[]> = relatedItemPairs$.pipe(
      map((relatedItemPairs: Array<[Item, Item]>) => {
        return relatedItemPairs
          .map(([left, right]: [Item, Item]) => left.uuid === this.item.uuid ? left : right)
      })
    );

    relatedItems$.pipe(take(1)).subscribe((relatedItems) => {
        let index = 0;
        virtualMDs.forEach(
          (md: MetadataValue) => {
            this.relationshipService.setNameVariant(this.listId, relatedItems[index].uuid, md.value);
            index++;
          }
        );
      }
    )
  }

  /**
   * Called when an external object has been imported, resets the total values and adds the object to the selected list
   * @param object
   */
  imported(object) {
    this.setTotals();
    this.select(object);
  }

  /**
   * Calculate and set the total entries available for each tab
   */
  setTotals() {
    this.totalInternal$ = this.searchConfigService.paginatedSearchOptions.pipe(
      switchMap((options) => this.lookupRelationService.getTotalLocalResults(this.relationshipOptions, options))
    );

    const externalSourcesAndOptions$ = combineLatest(
      this.externalSourcesRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload()
      ),
      this.searchConfigService.paginatedSearchOptions
    );

    this.totalExternal$ = externalSourcesAndOptions$.pipe(
      switchMap(([sources, options]) =>
        observableZip(...sources.page.map((source: ExternalSource) => this.lookupRelationService.getTotalExternalResults(source, options))))
    );
  }

  ngOnDestroy() {
    Object.values(this.subMap).forEach((subscription) => subscription.unsubscribe());
  }
}
