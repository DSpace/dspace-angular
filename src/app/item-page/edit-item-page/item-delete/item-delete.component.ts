// eslint-disable-next-line max-classes-per-file
import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  defaultIfEmpty,
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { LinkService } from '../../../core/cache/builders/link.service';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ListableObjectComponentLoaderComponent } from '../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { VarDirective } from '../../../shared/utils/var.directive';
import { getItemEditRoute } from '../../item-page-routing-paths';
import { ModifyItemOverviewComponent } from '../modify-item-overview/modify-item-overview.component';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
import { VirtualMetadata } from '../virtual-metadata/virtual-metadata.component';

/**
 * Data Transfer Object used to prevent the HTML template to call function returning Observables
 */
class RelationshipTypeDTO {

  relationshipType: RelationshipType;

  isSelected$: Observable<boolean>;

  label$: Observable<string>;

  relationshipDTOs$: Observable<RelationshipDTO[]>;

}

/**
 * Data Transfer Object used to prevent the HTML template to call function returning Observables
 */
class RelationshipDTO {

  relationship: Relationship;

  relatedItem$: Observable<Item>;

  virtualMetadata$: Observable<VirtualMetadata[]>;

}

@Component({
  selector: 'ds-item-delete',
  templateUrl: '../item-delete/item-delete.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ListableObjectComponentLoaderComponent,
    ModifyItemOverviewComponent,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
/**
 * Component responsible for rendering the item delete page
 */
export class ItemDeleteComponent
  extends AbstractSimpleItemActionComponent
  implements OnInit, OnDestroy {

  /**
   * The current url of this page
   */
  @Input() url: string;

  protected messageKey = 'delete';

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.ListElement;

  /**
   * A list of the relationship types for which this item has relations as an observable.
   * The list doesn't contain duplicates.
   */
  typeDTOs$: BehaviorSubject<RelationshipTypeDTO[]> = new BehaviorSubject([]);

  /**
   * A map which stores the relationships of this item for each type as observable lists
   */
  relationships$: Map<RelationshipType, Observable<Relationship[]>>
    = new Map<RelationshipType, Observable<Relationship[]>>();

  /**
   * A map which stores the related item of each relationship of this item as an observable
   */
  relatedItems$: Map<Relationship, Observable<Item>> = new Map<Relationship, Observable<Item>>();

  /**
   * A map which stores the virtual metadata (of the related) item corresponding to each relationship of this item
   * as an observable list
   */
  virtualMetadata$: Map<Relationship, Observable<VirtualMetadata[]>> = new Map<Relationship, Observable<VirtualMetadata[]>>();

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  public isDeleting$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected itemDataService: ItemDataService,
              protected translateService: TranslateService,
              protected modalService: NgbModal,
              protected objectUpdatesService: ObjectUpdatesService,
              protected relationshipService: RelationshipDataService,
              protected entityTypeService: EntityTypeDataService,
              protected linkService: LinkService,
  ) {
    super(
      route,
      router,
      notificationsService,
      itemDataService,
      translateService,
    );
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit() {

    super.ngOnInit();
    this.url = this.router.url;

    const label = this.item.firstMetadataValue('dspace.entity.type');
    if (isNotEmpty(label)) {
      this.subs.push(this.entityTypeService.getEntityTypeByLabel(label).pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        switchMap((entityType) => this.entityTypeService.getEntityTypeRelationships(entityType.id)),
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        map((relationshipTypes) => relationshipTypes.page),
        switchMap((types) => {
          if (types.length === 0) {
            return of(types);
          }
          return combineLatest(types.map((type) => this.getRelationships(type))).pipe(
            map((relationships) =>
              types.reduce<RelationshipType[]>((includedTypes, type, index) => {
                if (!includedTypes.some((includedType) => includedType.id === type.id)
                  && !(relationships[index].length === 0)) {
                  return [...includedTypes, type];
                } else {
                  return includedTypes;
                }
              }, []),
            ),
          );
        }),
      ).subscribe((types: RelationshipType[]) => this.typeDTOs$.next(types.map((relationshipType: RelationshipType) => Object.assign(new RelationshipTypeDTO(), {
        relationshipType: relationshipType,
        isSelected$: this.isSelected(relationshipType),
        label$: this.getLabel(relationshipType),
        relationshipDTOs$: this.getRelationships(relationshipType).pipe(
          map((relationships: Relationship[]) => relationships.map((relationship: Relationship) => Object.assign(new RelationshipDTO(), {
            relationship: relationship,
            relatedItem$: this.getRelatedItem(relationship),
            virtualMetadata$: this.getVirtualMetadata(relationship),
          } as RelationshipDTO))),
        ),
      })))));
    }

    this.subs.push(this.typeDTOs$.pipe(
      take(1),
    ).subscribe((types: RelationshipTypeDTO[]) =>
      this.objectUpdatesService.initialize(this.url, types.map((relationshipTypeDto: RelationshipTypeDTO) => relationshipTypeDto.relationshipType), this.item.lastModified),
    ));
  }

  /**
   * Open the modal which lists the virtual metadata of a relation
   * @param content the html content of the modal
   */
  openVirtualMetadataModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Close the modal which lists the virtual metadata of a relation
   */
  closeVirtualMetadataModal() {
    this.modalRef.close();
  }

  /**
   * Get the i18n message key for a relationship
   * @param label   The relationship type's label
   */
  getRelationshipMessageKey(label: string): string {
    if (hasValue(label) && label.indexOf('Of') > -1) {
      return `relationships.${label.substring(0, label.indexOf('Of') + 2)}`;
    } else {
      return label;
    }
  }

  /**
   * Get the relationship type label relevant for this item as an observable
   * @param relationshipType  the relationship type to get the label for
   */
  getLabel(relationshipType: RelationshipType): Observable<string> {

    return this.getRelationships(relationshipType).pipe(
      switchMap((relationships) =>
        this.isLeftItem(relationships[0]).pipe(
          map((isLeftItem) => isLeftItem ? relationshipType.leftwardType : relationshipType.rightwardType),
        ),
      ),
    );
  }

  /**
   * Get the relationships of this item with a given type as an observable
   * @param relationshipType  the relationship type to filter the item's relationships on
   */
  getRelationships(relationshipType: RelationshipType): Observable<Relationship[]> {

    if (!this.relationships$.has(relationshipType)) {
      this.relationships$.set(
        relationshipType,
        this.relationshipService.getItemRelationshipsArray(this.item).pipe(
          // filter on type
          switchMap((relationships) =>
            observableCombineLatest(
              relationships.map((relationship) => this.getRelationshipType(relationship)),
            ).pipe(
              defaultIfEmpty([]),
              map((types) => relationships.filter(
                (relationship, index) => relationshipType.id === types[index].id,
              )),
            ),
          ),
        ),
      );
    }

    return this.relationships$.get(relationshipType);
  }

  /**
   * Get the type of a given relationship as an observable
   * @param relationship  the relationship to get the type for
   */
  private getRelationshipType(relationship: Relationship): Observable<RelationshipType> {

    this.linkService.resolveLinks(
      relationship,
      followLink('relationshipType'),
      followLink('leftItem', undefined, followLink<Item>('accessStatus')),
      followLink('rightItem', undefined, followLink<Item>('accessStatus')),
    );
    return relationship.relationshipType.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      filter((relationshipType: RelationshipType) => hasValue(relationshipType) && isNotEmpty(relationshipType.uuid)),
    );
  }

  /**
   * Get the item this item is related to through a given relationship as an observable
   * @param relationship  the relationship to get the other item for
   */
  getRelatedItem(relationship: Relationship): Observable<Item> {

    if (!this.relatedItems$.has(relationship)) {

      this.relatedItems$.set(
        relationship,
        this.isLeftItem(relationship).pipe(
          switchMap((isLeftItem) => isLeftItem ? relationship.rightItem : relationship.leftItem),
          getFirstSucceededRemoteData(),
          getRemoteDataPayload(),
        ),
      );
    }

    return this.relatedItems$.get(relationship);
  }

  /**
   * Get the virtual metadata for a given relationship of the related item.
   * @param relationship  the relationship to get the virtual metadata for
   */
  getVirtualMetadata(relationship: Relationship): Observable<VirtualMetadata[]> {

    if (!this.virtualMetadata$.has(relationship)) {

      this.virtualMetadata$.set(
        relationship,
        this.getRelatedItem(relationship).pipe(
          map((relatedItem) =>
            Object.entries(relatedItem.metadata)
              .map(([key, value]) => value
                .filter((metadata: MetadataValue) =>
                  metadata.authority && metadata.authority.endsWith(relationship.id))
                .map((metadata: MetadataValue) => {
                  return {
                    metadataField: key,
                    metadataValue: metadata,
                  };
                }))
              .reduce((previous, current) => previous.concat(current)),
          ),
        ),
      );
    }

    return this.virtualMetadata$.get(relationship);
  }

  /**
   * Check whether this item is the left item of a given relationship, as an observable boolean
   * @param relationship  the relationship for which to check whether this item is the left item
   */
  private isLeftItem(relationship: Relationship): Observable<boolean> {

    return relationship.leftItem.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      filter((item: Item) => hasValue(item) && isNotEmpty(item.uuid)),
      map((leftItem) => leftItem.uuid === this.item.uuid),
    );
  }

  /**
   * Check whether a given relationship type is selected to save the corresponding virtual metadata
   * @param type  the relationship type for which to check whether it is selected
   */
  isSelected(type: RelationshipType): Observable<boolean> {
    return this.objectUpdatesService.isSelectedVirtualMetadata(this.url, this.item.uuid, type.uuid);
  }

  /**
   * Select/deselect a given relationship type to save the corresponding virtual metadata
   * @param type      the relationship type to select/deselect
   * @param selected  whether the type should be selected
   */
  setSelected(type: RelationshipType, selected: boolean): void {
    if (this.isDeleting$.value === false) {
      this.objectUpdatesService.setSelectedVirtualMetadata(this.url, this.item.uuid, type.uuid, selected);
    }
  }

  /**
   * Perform the delete operation
   */
  performAction(): void {
    this.isDeleting$.next(true);
    this.subs.push(this.typeDTOs$.pipe(
      switchMap((types: RelationshipTypeDTO[]) =>
        combineLatest(
          types.map((type: RelationshipTypeDTO) => type.isSelected$),
        ).pipe(
          defaultIfEmpty([]),
          map((selection: boolean[]) => types.filter(
            (type: RelationshipTypeDTO, index: number) => selection[index],
          )),
          map((selectedDtoTypes: RelationshipTypeDTO[]) => selectedDtoTypes.map((typeDto: RelationshipTypeDTO) => typeDto.relationshipType.id)),
        ),
      ),
      switchMap((types: string[]) => this.itemDataService.delete(this.item.id, types)),
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<NoContent>) => {
      this.notify(rd.hasSucceeded);
    }));
  }

  /**
   * When the item is successfully delete, navigate to the homepage, otherwise navigate back to the item edit page
   * @param succeeded
   */
  notify(succeeded: boolean) {
    if (succeeded) {
      this.notificationsService.success(this.translateService.get('item.edit.' + this.messageKey + '.success'));
      void this.router.navigate(['']);
    } else {
      this.notificationsService.error(this.translateService.get('item.edit.' + this.messageKey + '.error'));
      void this.router.navigate([getItemEditRoute(this.item)]);
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
