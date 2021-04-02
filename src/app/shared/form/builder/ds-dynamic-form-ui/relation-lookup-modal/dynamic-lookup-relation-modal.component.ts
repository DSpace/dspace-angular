import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue, isNotEmpty } from '../../../../empty.util';
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
  getAllSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../../../../core/shared/operators';
import { AddRelationshipAction, RemoveRelationshipAction, UpdateRelationshipNameVariantAction } from './relationship.actions';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { Context } from '../../../../../core/shared/context.model';
import { LookupRelationService } from '../../../../../core/data/lookup-relation.service';
import { ExternalSource } from '../../../../../core/shared/external-source.model';
import { ExternalSourceService } from '../../../../../core/data/external-source.service';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { followLink } from '../../../../utils/follow-link-config.model';
import { SubmissionObject } from '../../../../../core/submission/models/submission-object.model';
import { Collection } from '../../../../../core/shared/collection.model';
import { SubmissionService } from '../../../../../submission/submission.service';
import { SubmissionObjectDataService } from '../../../../../core/submission/submission-object-data.service';
import { RemoteData } from '../../../../../core/data/remote-data';

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
  @Output() selectEvent: EventEmitter<ListableObject[]> = new EventEmitter<ListableObject[]>();

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

  query: string;

  /**
   * A map of subscriptions within this component
   */
  subMap: {
    [uuid: string]: Subscription
  } = {};
  submissionId: string;

  /**
   * A list of the available external sources configured for this relationship
   */
  externalSourcesRD$: Observable<ExternalSource[]>;

  /**
   * The total amount of internal items for the current options
   */
  totalInternal$: Observable<number>;

  /**
   * The total amount of results for each external source using the current options
   */
  totalExternal$: Observable<number[]>;

  /**
   * List of subscriptions to unsubscribe from
   */
  private subs: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private selectableListService: SelectableListService,
    private relationshipService: RelationshipService,
    private relationshipTypeService: RelationshipTypeService,
    private externalSourceService: ExternalSourceService,
    private lookupRelationService: LookupRelationService,
    private searchConfigService: SearchConfigurationService,
    private rdbService: RemoteDataBuildService,
    private submissionService: SubmissionService,
    private submissionObjectService: SubmissionObjectDataService,
    private zone: NgZone,
    private store: Store<AppState>,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.setItem();
    this.selection$ = this.selectableListService
      .getSelectableList(this.listId)
      .pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
    this.selection$.pipe(take(1)).subscribe((selection) =>
      selection.map((s: SearchResult<Item>) => this.addNameVariantSubscription(s))
    );
    if (this.relationshipOptions.nameVariants === 'true') {
      this.context = Context.EntitySearchModalWithNameVariants;
    } else {
      this.context = Context.EntitySearchModal;
    }

    if (isNotEmpty(this.relationshipOptions.externalSources)) {
      this.externalSourcesRD$ = this.rdbService.aggregate(
        this.relationshipOptions.externalSources.map((source) => this.externalSourceService.findById(source))
      ).pipe(
        getAllSucceededRemoteDataPayload()
      );
    }

    this.setTotals();
  }

  close() {
    this.modal.close();
  }

  /**
   * Select (a list of) objects and add them to the store
   * @param selectableObjects
   */
  select(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => {
        const obs: Observable<any[]> = observableCombineLatest(...selectableObjects.map((sri: SearchResult<Item>) => {
            this.addNameVariantSubscription(sri);
            return this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid)
              .pipe(
                take(1),
                map((nameVariant: string) => {
                  return {
                    item: sri.indexableObject,
                    nameVariant
                  };
                })
              );
          })
        );
        obs
          .subscribe((arr: any[]) => {
            return arr.forEach((object: any) => {
              const addRelationshipAction = new AddRelationshipAction(this.item, object.item, this.relationshipOptions.relationshipType, this.submissionId, object.nameVariant);
              this.store.dispatch(addRelationshipAction);
              }
            );
          });
      });
  }

  /**
   *  Initialize this.item$ based on this.model.submissionId
   */
  private setItem() {
    const submissionObject$ = this.submissionObjectService
      .findById(this.submissionId, true, true, followLink('item'), followLink('collection')).pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload()
      );

    const item$ = submissionObject$.pipe(switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));
    const collection$ = submissionObject$.pipe(switchMap((submissionObject: SubmissionObject) => (submissionObject.collection as Observable<RemoteData<Collection>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));

    this.subs.push(item$.subscribe((item) => this.item = item));
    this.subs.push(collection$.subscribe((collection) => this.collection = collection));

  }

  /**
   * Add a subscription updating relationships with name variants
   * @param sri The search result to track name variants for
   */
  private addNameVariantSubscription(sri: SearchResult<Item>) {
    const nameVariant$ = this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid);
    this.subMap[sri.indexableObject.uuid] = nameVariant$.pipe(
      skip(1),
    ).subscribe((nameVariant: string) => this.store.dispatch(new UpdateRelationshipNameVariantAction(this.item, sri.indexableObject, this.relationshipOptions.relationshipType, this.submissionId, nameVariant)));
  }

  /**
   * Deselect (a list of) objects and remove them from the store
   * @param selectableObjects
   */
  deselect(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => selectableObjects.forEach((object) => {
        this.subMap[object.indexableObject.uuid].unsubscribe();
        this.store.dispatch(new RemoveRelationshipAction(this.item, object.indexableObject, this.relationshipOptions.relationshipType, this.submissionId));
      })
    );
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

    const externalSourcesAndOptions$ = observableCombineLatest(
      this.externalSourcesRD$,
      this.searchConfigService.paginatedSearchOptions
    );

    this.totalExternal$ = externalSourcesAndOptions$.pipe(
      switchMap(([sources, options]) =>
        observableCombineLatest(...sources.map((source: ExternalSource) => this.lookupRelationService.getTotalExternalResults(source, options))))
    );
  }

  ngOnDestroy() {
    this.router.navigate([], {});
    Object.values(this.subMap).forEach((subscription) => subscription.unsubscribe());
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
