import { Component, NgZone, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue, hasValueOperator } from '../../../../empty.util';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../../object-list/selectable-list/selectable-list.reducer';
import { ListableObject } from '../../../../object-collection/shared/listable-object.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { SearchResult } from '../../../../search/search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { RemoteData } from '../../../../../core/data/remote-data';
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

export class DsDynamicLookupRelationModalComponent implements OnInit {
  label: string;
  relationshipOptions: RelationshipOptions;
  listId: string;
  itemRD$;
  repeatable: boolean;
  selection$: Observable<ListableObject[]>;
  context: Context;
  metadataFields: string;

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
    this.selection$ = this.selectableListService.getSelectableList(this.listId).pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
    if (this.relationshipOptions.nameVariants) {
      this.context = Context.Submission;
    }
    this.itemRD$.subscribe((r) => console.log(r));
    this.setExistingNameVariants();
  }

  close() {
    this.modal.close();
  }

  select(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => {
        const obs: Observable<any[]> = combineLatest(...selectableObjects.map((sri: SearchResult<Item>) => {
            return this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid)
              .pipe(map((nameVariant: string) => {
                  return {
                    item: sri.indexableObject,
                    nameVariant
                  }
                })
              )
          })
        );

        combineLatest(this.itemRD$.pipe(getSucceededRemoteData()), obs)
          .subscribe(([itemRD, obs]: [RemoteData<Item>, any[]]) => {
            return obs.forEach((object: any) =>
              this.store.dispatch(new AddRelationshipAction(itemRD.payload, object.item, this.relationshipOptions.relationshipType, object.nameVariant))
            );
          })
      });
  }

  deselect(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => this.itemRD$.pipe(
        getSucceededRemoteData(),
        tap((itemRD: RemoteData<Item>) => {
            return selectableObjects.forEach((object) =>
              this.store.dispatch(new RemoveRelationshipAction(itemRD.payload, object.indexableObject, this.relationshipOptions.relationshipType))
            );
          }
        )
      ).subscribe()
    );
  }

  setExistingNameVariants() {
    const virtualMDs$: Observable<MetadataValue[]> = this.itemRD$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((item: Item) => item.allMetadata(this.metadataFields).filter((mdValue) => mdValue.isVirtual)));

    const relatedItemPairs$: Observable<[Item, Item][]> = virtualMDs$.pipe(
      switchMap((mds: MetadataValue[]) => combineLatest(mds.map((md: MetadataValue) => this.relationshipService.findById(md.virtualValue).pipe(getSucceededRemoteData(), getRemoteDataPayload())))),
      switchMap((relationships: Relationship[]) => combineLatest(relationships.map((relationship: Relationship) =>
          combineLatest(
            relationship.leftItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()),
            relationship.rightItem.pipe(getSucceededRemoteData(), getRemoteDataPayload())
          ))
        )
      ),
    );

    const relatedItems$: Observable<Item[]> = combineLatest(relatedItemPairs$, this.itemRD$).pipe(
      map(([relatedItemPairs, itemRD]: [[Item, Item][], RemoteData<Item>]) => relatedItemPairs.map(([left, right]: [Item, Item]) => left.uuid === itemRD.payload.uuid ? left : right))
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
}