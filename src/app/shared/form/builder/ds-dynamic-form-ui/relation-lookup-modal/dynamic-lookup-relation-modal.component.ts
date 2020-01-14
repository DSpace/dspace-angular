import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
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
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { AddRelationshipAction, RemoveRelationshipAction, UpdateRelationshipAction } from './relationship.actions';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { Context } from '../../../../../core/shared/context.model';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';

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
  label: string;
  relationshipOptions: RelationshipOptions;
  listId: string;
  item;
  repeatable: boolean;
  selection$: Observable<ListableObject[]>;
  context: Context;
  metadataFields: string;
  subMap: {
    [uuid: string]: Subscription
  } = {};

  constructor(
    public modal: NgbActiveModal,
    private selectableListService: SelectableListService,
    private relationshipService: RelationshipService,
    private relationshipTypeService: RelationshipTypeService,
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

    // this.setExistingNameVariants();
  }

  close() {
    this.modal.close();
  }

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

  private addNameVariantSubscription(sri: SearchResult<Item>) {
    const nameVariant$ = this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid);
    this.subMap[sri.indexableObject.uuid] = nameVariant$.pipe(
      skip(1),
    ).subscribe((nameVariant: string) => this.store.dispatch(new UpdateRelationshipAction(this.item, sri.indexableObject, this.relationshipOptions.relationshipType, nameVariant)))
  }

  deselect(...selectableObjects: Array<SearchResult<Item>>) {
    this.zone.runOutsideAngular(
      () => selectableObjects.forEach((object) => {
        this.subMap[object.indexableObject.uuid].unsubscribe();
        this.store.dispatch(new RemoveRelationshipAction(this.item, object.indexableObject, this.relationshipOptions.relationshipType));
      })
    );
  }

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

  ngOnDestroy() {
    Object.values(this.subMap).forEach((subscription) => subscription.unsubscribe());
  }
}
