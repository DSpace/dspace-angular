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
import { UntypedFormControl } from '@angular/forms';
import {
  FormFieldMetadataValueObject,
  getAllSucceededRemoteData,
  getRemoteDataPayload,
  Item,
  ItemMetadataRepresentation,
  ItemSearchResult,
  MetadataRepresentation,
  MetadataValue,
  RelationshipOptions,
  RemoveRelationshipAction,
  Reorderable,
  ReorderableRelationship,
  SelectableListService,
  SubmissionObjectEntry,
  SubmissionService,
} from '@dspace/core';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';
import { DynamicFormArrayGroupModel } from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { AppState } from '../../../../../app.reducer';
import { ThemedLoadingComponent } from '../../../../loading/themed-loading.component';
import { MetadataRepresentationLoaderComponent } from '../../../../metadata-representation/metadata-representation-loader.component';
import { DynamicConcatModel } from '../models/ds-dynamic-concat.model';


/**
 * A Reorderable representation of a FormFieldMetadataValue
 */
export class ReorderableFormFieldMetadataValue extends Reorderable {

  constructor(
    public metadataValue: FormFieldMetadataValueObject,
    public model: DynamicConcatModel,
    public control: UntypedFormControl,
    public group: DynamicFormArrayGroupModel,
    oldIndex?: number,
    newIndex?: number,
  ) {
    super(oldIndex, newIndex);
    this.metadataValue = metadataValue;
  }

  /**
   * Return the id for this Reorderable
   */
  getId(): string {
    if (hasValue(this.metadataValue.authority)) {
      return this.metadataValue.authority;
    } else {
      // can't use UUIDs, they're generated client side
      return this.metadataValue.value;
    }
  }

  /**
   * Return the place metadata for this Reorderable
   */
  getPlace(): number {
    return this.metadataValue.place;
  }

}

/**
 * Represents a single existing relationship value as metadata in submission
 */
@Component({
  selector: 'ds-existing-metadata-list-element',
  templateUrl: './existing-metadata-list-element.component.html',
  styleUrls: ['./existing-metadata-list-element.component.scss'],
  imports: [
    ThemedLoadingComponent,
    AsyncPipe,
    MetadataRepresentationLoaderComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class ExistingMetadataListElementComponent implements OnInit, OnChanges, OnDestroy   {
  @Input() listId: string;
  @Input() submissionItem: Item;
  @Input() reoRel: ReorderableRelationship;
  @Input() metadataFields: string[];
  @Input() relationshipOptions: RelationshipOptions;
  @Input() submissionId: string;
  metadataRepresentation$: BehaviorSubject<MetadataRepresentation> = new BehaviorSubject<MetadataRepresentation>(undefined);
  relatedItem: Item;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  /**
   * List of subscriptions to unsubscribe from
   */
  private subs: Subscription[] = [];

  constructor(
    private selectableListService: SelectableListService,
    private store: Store<AppState>,
    private submissionService: SubmissionService,
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
        this.relatedItem = item;
        const relationMD: MetadataValue = this.submissionItem.firstMetadata(this.relationshipOptions.metadataField, { value: this.relatedItem.uuid });
        if (hasValue(relationMD)) {
          const metadataRepresentationMD: MetadataValue = this.submissionItem.firstMetadata(this.metadataFields, { authority: relationMD.authority });

          const nextValue = Object.assign(
            new ItemMetadataRepresentation(metadataRepresentationMD),
            this.relatedItem,
          );
          this.metadataRepresentation$.next(nextValue);
        }
      }));
    }
  }

  /**
   * Removes the selected relationship from the list
   */
  removeSelection() {
    this.submissionService.dispatchSave(this.submissionId);
    this.submissionService.getSubmissionObject(this.submissionId).pipe(
      filter((state: SubmissionObjectEntry) => !state.savePending && !state.isLoading),
      take(1)).subscribe(() => {
      this.selectableListService.deselectSingle(this.listId, Object.assign(new ItemSearchResult(), { indexableObject: this.relatedItem }));
      this.store.dispatch(new RemoveRelationshipAction(this.submissionItem, this.relatedItem, this.relationshipOptions.relationshipType, this.submissionId));
      this.remove.emit();
    });
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

