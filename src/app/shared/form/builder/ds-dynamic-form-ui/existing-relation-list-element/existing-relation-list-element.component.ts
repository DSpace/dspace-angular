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
import { ItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { RelationshipOptions } from '../../../../../../../modules/core/src/lib/core/shared/form/relationship-options.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { ReorderableRelationship } from '../../../../../../../modules/core/src/lib/core/shared/item-relationships/reorderable-relationship.model';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../../../../../modules/core/src/lib/core/shared/operators';
import { ViewMode } from '../../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { RemoveRelationshipAction } from '../../../../../../../modules/core/src/lib/core/states/name-variant/relationship.actions';
import { SubmissionService } from '../../../../../submission/submission.service';
import { ThemedLoadingComponent } from '../../../../loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';


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

