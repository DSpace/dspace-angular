import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, QueryList } from '@angular/core';
import {
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { SubmissionObjectDataService } from '../../../../../core/submission/submission-object-data.service';
import { FormGroup } from '@angular/forms';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { Reorderable, ReorderableRelationship } from '../existing-metadata-list-element/existing-metadata-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { hasValue } from '../../../../empty.util';
import { getAllSucceededRemoteData, getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { map, startWith, switchMap } from 'rxjs/operators';
import { SubmissionObject } from '../../../../../core/submission/models/submission-object.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { SearchResult } from '../../../../search/search-result.model';
import { DsDynamicLookupRelationModalComponent } from '../relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ds-dynamic-form-control-container-wrapper',
  templateUrl: './ds-dynamic-form-control-container-wrapper.component.html',
  styleUrls: ['./ds-dynamic-form-control-container-wrapper.component.scss']
})
export class DsDynamicFormControlContainerWrapperComponent implements OnInit, OnDestroy {
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() formId: string;
  @Input() context: any | null = null;
  @Input() group: FormGroup;
  @Input() hasErrorMessaging = false;
  @Input() layout = null as DynamicFormLayout;
  @Input() model: any;

  reorderables$: Observable<ReorderableRelationship[]>;
  reorderables: ReorderableRelationship[];
  hasRelationLookup: boolean;
  modalRef: NgbModalRef;
  item: Item;
  listId: string;
  searchConfig: string;

  /**
   * List of subscriptions to unsubscribe from
   */
  private subs: Subscription[] = [];

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected translateService: TranslateService,
    private modalService: NgbModal,
    private relationService: RelationshipService,
    private selectableListService: SelectableListService,
    private itemService: ItemDataService,
    private relationshipService: RelationshipService,
    private zone: NgZone,
    private store: Store<AppState>,
    private submissionObjectService: SubmissionObjectDataService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.hasRelationLookup = hasValue(this.model.relationship);
    this.reorderables = [];
    if (this.hasRelationLookup) {
      this.listId = 'list-' + this.model.relationship.relationshipType;
      const item$ = this.submissionObjectService
        .findById(this.model.submissionId).pipe(
          getAllSucceededRemoteData(),
          getRemoteDataPayload(),
          switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>)
            .pipe(
              getAllSucceededRemoteData(),
              getRemoteDataPayload()
            )
          )
        );

      this.subs.push(item$.subscribe((item) => this.item = item));
      this.reorderables$ = item$.pipe(
        switchMap((item) => this.relationService.getItemRelationshipsByLabel(item, this.model.relationship.relationshipType)
          .pipe(
            getAllSucceededRemoteData(),
            getRemoteDataPayload(),
            map((relationshipList: PaginatedList<Relationship>) => relationshipList.page),
            startWith([]),
            switchMap((relationships: Relationship[]) =>
              observableCombineLatest(
                relationships.map((relationship: Relationship) =>
                  relationship.leftItem.pipe(
                    getSucceededRemoteData(),
                    getRemoteDataPayload(),
                    map((leftItem: Item) => {
                      return new ReorderableRelationship(relationship, leftItem.uuid !== this.item.uuid)
                    }),
                  )
                )
              )
            ),
            map((relationships: ReorderableRelationship[]) =>
              relationships
                .sort((a: Reorderable, b: Reorderable) => {
                    return Math.sign(a.getPlace() - b.getPlace());
                  }
                )
            )
          )
        )
      );

      this.subs.push(this.reorderables$.subscribe((rs) => {
        this.reorderables = rs;
        this.ref.detectChanges();
      }));

      this.relationService.getRelatedItemsByLabel(this.item, this.model.relationship.relationshipType).pipe(
        map((items: RemoteData<PaginatedList<Item>>) => items.payload.page.map((item) => Object.assign(new ItemSearchResult(), { indexableObject: item }))),
      ).subscribe((relatedItems: Array<SearchResult<Item>>) => this.selectableListService.select(this.listId, relatedItems));
    }
  }

  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent, {
      size: 'lg'
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.repeatable = this.model.repeatable;
    modalComp.listId = this.listId;
    modalComp.relationshipOptions = this.model.relationship;
    modalComp.label = this.model.label;
    modalComp.metadataFields = this.model.metadataFields;
    modalComp.item = this.item;
  }

  addValue() {
    // console.log(this.model.value);
    // const event = { type: DynamicFormControlEventType.Change, model: this.model } as any;
    // this.change.emit(event);
  }

  moveSelection(event: CdkDragDrop<Relationship>) {
    this.zone.runOutsideAngular(() => {
      moveItemInArray(this.reorderables, event.previousIndex, event.currentIndex);
      const reorderables = this.reorderables.map((reo: Reorderable, index: number) => {
          reo.oldIndex = reo.getPlace();
          reo.newIndex = index;
          return reo;
        }
      );
      return observableCombineLatest(reorderables.map((rel: ReorderableRelationship) => {
          if (rel.oldIndex !== rel.newIndex) {
            return this.relationshipService.updatePlace(rel);
          } else {
            return observableOf(undefined);
          }
        })
      ).pipe(getSucceededRemoteData()).subscribe();
    })
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackReorderable(index, reorderable: Reorderable) {
    return hasValue(reorderable) ? reorderable.getId() : undefined;
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
