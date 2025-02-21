/* eslint-disable max-classes-per-file */
import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from '../../../../../app.reducer';
import { ItemSearchResult } from '@dspace/core';
import { RelationshipOptions } from '@dspace/core';
import { Item } from '@dspace/core';
import { ReorderableRelationship } from '@dspace/core';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload,
} from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { RemoveRelationshipAction } from '@dspace/core';
import { SubmissionService } from '@dspace/core';
import { ThemedLoadingComponent } from '../../../../loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SelectableListService } from '@dspace/core';


/**
 * Represents a single existing relationship value as metadata in submission
 */
@Component({
  selector: 'ds-existing-relation-list-element',
  templateUrl: './existing-relation-list-element.component.html',
  styleUrls: ['./existing-relation-list-element.component.scss'],
  imports: [
    ThemedLoadingComponent,
    AsyncPipe,
    ListableObjectComponentLoaderComponent,
  ],
  standalone: true,
})
export class ExistingRelationListElementComponent implements OnInit, OnChanges, OnDestroy {
  @Input() listId: string;
  @Input() submissionItem: Item;
  @Input() reoRel: ReorderableRelationship;
  @Input() metadataFields: string[];
  @Input() relationshipOptions: RelationshipOptions;
  @Input() submissionId: string;
  relatedItem$: BehaviorSubject<Item> = new BehaviorSubject<Item>(undefined);
  viewType = ViewMode.ListElement;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  /**
   * List of subscriptions to unsubscribe from
   */
  private subs: Subscription[] = [];

  constructor(
    private selectableListService: SelectableListService,
    private submissionService: SubmissionService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit(): void {
    this.ngOnChanges();
  }

  /**
   * Change callback for the component
   */
  ngOnChanges() {
    if (hasValue(this.reoRel)) {
      const item$ = this.reoRel.useLeftItem ?
        this.reoRel.relationship.leftItem : this.reoRel.relationship.rightItem;
      this.subs.push(item$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        filter((item: Item) => hasValue(item) && isNotEmpty(item.uuid)),
      ).subscribe((item: Item) => {
        this.relatedItem$.next(item);
      }));
    }

  }

  /**
   * Removes the selected relationship from the list
   */
  removeSelection() {
    this.submissionService.dispatchSave(this.submissionId);
    this.selectableListService.deselectSingle(this.listId, Object.assign(new ItemSearchResult(), { indexableObject: this.relatedItem$.getValue() }));
    this.store.dispatch(new RemoveRelationshipAction(this.submissionItem, this.relatedItem$.getValue(), this.relationshipOptions.relationshipType, this.submissionId));
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

