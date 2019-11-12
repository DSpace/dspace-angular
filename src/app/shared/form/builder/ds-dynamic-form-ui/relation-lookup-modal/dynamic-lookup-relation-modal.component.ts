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
import { AddRelationshipAction, RemoveRelationshipAction } from './relationship.actions';
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
    this.selection$.subscribe((selection) =>
      selection.map((s: SearchResult<Item>) => this.addNameVariantSubscription(s))
    );
    if (this.relationshipOptions.nameVariants) {
      this.context = Context.Workspace;
    }
  }

  close() {
    this.modal.close();
  }

  select(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => {
        const obs: Observable<any[]> = combineLatest(...selectableObjects.map((sri: SearchResult<Item>) => {
            const nameVariant$ = this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid);
            this.subMap[sri.indexableObject.uuid] = nameVariant$
              .pipe(skip(1))
              .subscribe((nameVariant: string) =>
                this.relationshipService.updateNameVariant(this.item, sri.indexableObject, this.relationshipOptions.relationshipType, nameVariant).subscribe()
              );
            return nameVariant$
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
          .subscribe((obs: any[]) => {
            return obs.forEach((object: any) => {
                this.store.dispatch(new AddRelationshipAction(this.item, object.item, this.relationshipOptions.relationshipType, object.nameVariant));
              }
            );
          })
      });
  }

  addNameVariantSubscription(sri: SearchResult<Item>) {
    const nameVariant$ = this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid);
    this.subMap[sri.indexableObject.uuid] = nameVariant$.pipe(switchMap((nameVariant: string) =>
      this.relationshipService.updateNameVariant(this.item, sri.indexableObject, this.relationshipOptions.relationshipType, nameVariant)
    )).subscribe()
  }

  deselect(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => selectableObjects.forEach((object) => {
        this.subMap[object.indexableObject.uuid].unsubscribe();
        this.store.dispatch(new RemoveRelationshipAction(this.item, object.indexableObject, this.relationshipOptions.relationshipType));
      })
    )
    ;
  }

  setExistingNameVariants() {
    const virtualMDs$: Observable<MetadataValue[]> = this.item.allMetadata(this.metadataFields).filter((mdValue) => mdValue.isVirtual);

    const relatedItemPairs$: Observable<[Item, Item][]> = virtualMDs$.pipe(
      switchMap((mds: MetadataValue[]) => combineLatest(mds.map((md: MetadataValue) => this.relationshipService.findById(md.virtualValue).pipe(getSucceededRemoteData(), getRemoteDataPayload())))),
      switchMap((relationships: Relationship[]) => combineLatest(relationships.map((relationship: Relationship) =>
          combineLatest(
            relationship.leftItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()),
            relationship.rightItem.pipe(getSucceededRemoteData(), getRemoteDataPayload())
          ))
        )
      )
    );

    const relatedItems$: Observable<Item[]> = relatedItemPairs$.pipe(
      map(([relatedItemPairs,]: [[Item, Item][]]) => relatedItemPairs.map(([left, right]: [Item, Item]) => left.uuid === this.item.uuid ? left : right))
    );

    combineLatest(virtualMDs$, relatedItems$).pipe(take(1)).subscribe(([virtualMDs, relatedItems]) => {
        let index: number = 0;
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