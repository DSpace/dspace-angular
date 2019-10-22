import { Component, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue } from '../../../../empty.util';
import { map, tap } from 'rxjs/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../../object-list/selectable-list/selectable-list.reducer';
import { ListableObject } from '../../../../object-collection/shared/listable-object.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { SearchResult } from '../../../../search/search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { getSucceededRemoteData } from '../../../../../core/shared/operators';
import { RemoteData } from '../../../../../core/data/remote-data';
import { AddRelationshipAction, RemoveRelationshipAction } from './relationship.actions';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { Context } from '../../../../../core/shared/context.model';

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
  relationship: RelationshipOptions;
  listId: string;
  itemRD$;
  repeatable: boolean;
  selection$: Observable<ListableObject[]>;
  context: Context;

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
    if (this.relationship.nameVariants) {
      this.context = Context.Submission;
    }
  }

  close() {
    this.modal.close();
  }

  select(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => this.itemRD$
        .pipe(
          getSucceededRemoteData(),
          tap((itemRD: RemoteData<Item>) => {
              return selectableObjects.forEach((object) =>
                this.store.dispatch(new AddRelationshipAction(itemRD.payload, object.indexableObject, this.relationship.relationshipType))
              );
            }
          )
        ).subscribe());
  }


  deselect(...selectableObjects: SearchResult<Item>[]) {
    this.zone.runOutsideAngular(
      () => this.itemRD$.pipe(
        getSucceededRemoteData(),
        tap((itemRD: RemoteData<Item>) => {
            return selectableObjects.forEach((object) =>
              this.store.dispatch(new RemoveRelationshipAction(itemRD.payload, object.indexableObject, this.relationship.relationshipType))
            );
          }
        )
      ).subscribe()
    );
  }
}