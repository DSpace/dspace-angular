import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_INPUT,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_SELECT,
  DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
  DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
  DynamicDatePickerModel, DynamicFormComponentService,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService, DynamicFormRelationService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import {
  DynamicNGBootstrapCalendarComponent,
  DynamicNGBootstrapCheckboxComponent,
  DynamicNGBootstrapCheckboxGroupComponent,
  DynamicNGBootstrapInputComponent,
  DynamicNGBootstrapRadioGroupComponent,
  DynamicNGBootstrapSelectComponent,
  DynamicNGBootstrapTextAreaComponent,
  DynamicNGBootstrapTimePickerComponent
} from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { followLink } from '../../../utils/follow-link-config.model';
import {
  Reorderable,
  ReorderableRelationship
} from './existing-metadata-list-element/existing-metadata-list-element.component';

import { DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD } from './models/typeahead/dynamic-typeahead.model';
import { DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './models/tag/dynamic-tag.model';
import { DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER } from './models/date-picker/date-picker.model';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP } from './models/lookup/dynamic-lookup.model';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';
import { hasValue, isNotEmpty, isNotUndefined } from '../../../empty.util';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME } from './models/lookup/dynamic-lookup-name.model';
import { DsDynamicTagComponent } from './models/tag/dynamic-tag.component';
import { DsDatePickerComponent } from './models/date-picker/date-picker.component';
import { DsDynamicListComponent } from './models/list/dynamic-list.component';
import { DsDynamicTypeaheadComponent } from './models/typeahead/dynamic-typeahead.component';
import { DsDynamicScrollableDropdownComponent } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicLookupComponent } from './models/lookup/dynamic-lookup.component';
import { DsDynamicFormGroupComponent } from './models/form-group/dynamic-form-group.component';
import { DsDynamicFormArrayComponent } from './models/array-group/dynamic-form-array.component';
import { DsDynamicRelationGroupComponent } from './models/relation-group/dynamic-relation-group.components';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from './models/relation-group/dynamic-relation-group.model';
import { DsDatePickerInlineComponent } from './models/date-picker-inline/dynamic-date-picker-inline.component';
import { map, startWith, switchMap, find } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { SearchResult } from '../../../search/search-result.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { SelectableListService } from '../../../object-list/selectable-list/selectable-list.service';
import { DsDynamicDisabledComponent } from './models/disabled/dynamic-disabled.component';
import { DYNAMIC_FORM_CONTROL_TYPE_DISABLED } from './models/disabled/dynamic-disabled.model';
import { DsDynamicLookupRelationModalComponent } from './relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { getAllSucceededRemoteData, getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.reducer';
import { SubmissionObjectDataService } from '../../../../core/submission/submission-object-data.service';
import { SubmissionObject } from '../../../../core/submission/models/submission-object.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Collection } from '../../../../core/shared/collection.model';

export function dsDynamicFormControlMapFn(model: DynamicFormControlModel): Type<DynamicFormControl> | null {
  switch (model.type) {
    case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
      return DsDynamicFormArrayComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
      return DynamicNGBootstrapCheckboxComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
      return (model instanceof DynamicListCheckboxGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapCheckboxGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
      const datepickerModel = model as DynamicDatePickerModel;

      return datepickerModel.inline ? DynamicNGBootstrapCalendarComponent : DsDatePickerInlineComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
      return DsDynamicFormGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
      return DynamicNGBootstrapInputComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
      return (model instanceof DynamicListRadioGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapRadioGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
      return DynamicNGBootstrapSelectComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
      return DynamicNGBootstrapTextAreaComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
      return DynamicNGBootstrapTimePickerComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD:
      return DsDynamicTypeaheadComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN:
      return DsDynamicScrollableDropdownComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TAG:
      return DsDynamicTagComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP:
      return DsDynamicRelationGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER:
      return DsDatePickerComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP:
      return DsDynamicLookupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME:
      return DsDynamicLookupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DISABLED:
      return DsDynamicDisabledComponent;

    default:
      return null;
  }
}

@Component({
  selector: 'ds-dynamic-form-control-container',
  styleUrls: ['./ds-dynamic-form-control-container.component.scss'],
  templateUrl: './ds-dynamic-form-control-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DsDynamicFormControlContainerComponent extends DynamicFormControlContainerComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
  // tslint:disable-next-line:no-input-rename
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() formId: string;
  @Input() asBootstrapFormGroup = true;
  @Input() bindId = true;
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
  collection: Collection;
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
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* tslint:enable:no-output-rename */
  @ViewChild('componentViewContainer', { read: ViewContainerRef, static: true}) componentViewContainerRef: ViewContainerRef;

  private showErrorMessagesPreviousStage: boolean;

  get componentType(): Type<DynamicFormControl> | null {
    return dsDynamicFormControlMapFn(this.model);
  }

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected dynamicFormComponentService: DynamicFormComponentService,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected translateService: TranslateService,
    protected relationService: DynamicFormRelationService,
    private modalService: NgbModal,
    private relationshipService: RelationshipService,
    private selectableListService: SelectableListService,
    private itemService: ItemDataService,
    private zone: NgZone,
    private store: Store<AppState>,
    private submissionObjectService: SubmissionObjectDataService,
    private ref: ChangeDetectorRef
  ) {

    super(componentFactoryResolver, layoutService, validationService, dynamicFormComponentService, relationService);
  }

  /**
   * Sets up the necessary variables for when this control can be used to add relationships to the submitted item
   */
  ngOnInit(): void {
    this.hasRelationLookup = hasValue(this.model.relationship);
    this.reorderables = [];
    if (this.hasRelationLookup) {

      this.listId = 'list-' + this.model.relationship.relationshipType;

      const submissionObject$ = this.submissionObjectService
        .findById(this.model.submissionId, followLink('item'), followLink('collection')).pipe(
          getAllSucceededRemoteData(),
          getRemoteDataPayload()
        );

      const item$ = submissionObject$.pipe(switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));
      const collection$ = submissionObject$.pipe(switchMap((submissionObject: SubmissionObject) => (submissionObject.collection as Observable<RemoteData<Collection>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));

      this.subs.push(item$.subscribe((item) => this.item = item));
      this.subs.push(collection$.subscribe((collection) => this.collection = collection));
      this.reorderables$ = item$.pipe(
        switchMap((item) => this.relationshipService.getItemRelationshipsByLabel(item, this.model.relationship.relationshipType, undefined, followLink('leftItem'), followLink('rightItem'), followLink('relationshipType'))
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
                ))),
            map((relationships: ReorderableRelationship[]) =>
              relationships
                .sort((a: Reorderable, b: Reorderable) => {
                  return Math.sign(a.getPlace() - b.getPlace());
                })
            )
          )
        )
      );

      this.subs.push(this.reorderables$.subscribe((rs) => {
        this.reorderables = rs;
        this.ref.detectChanges();
      }));

      item$.pipe(
        switchMap((item) => this.relationshipService.getRelatedItemsByLabel(item, this.model.relationship.relationshipType)),
        map((items: RemoteData<PaginatedList<Item>>) => items.payload.page.map((item) => Object.assign(new ItemSearchResult(), { indexableObject: item }))),
      ).subscribe((relatedItems: Array<SearchResult<Item>>) => {
        this.selectableListService.select(this.listId, relatedItems)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      super.ngOnChanges(changes);
      if (this.model && this.model.placeholder) {
        this.model.placeholder = this.translateService.instant(this.model.placeholder);
      }
    }
  }

  ngDoCheck() {
    if (isNotUndefined(this.showErrorMessagesPreviousStage) && this.showErrorMessagesPreviousStage !== this.showErrorMessages) {
      this.showErrorMessagesPreviousStage = this.showErrorMessages;
      this.forceShowErrorDetection();
    }
  }

  ngAfterViewInit() {
    this.showErrorMessagesPreviousStage = this.showErrorMessages;
  }

  /**
   * Since Form Control Components created dynamically have 'OnPush' change detection strategy,
   * changes are not propagated. So use this method to force an update
   */
  protected forceShowErrorDetection() {
    if (this.showErrorMessages) {
      this.destroyFormControlComponent();
      this.createFormControlComponent();
    }
  }

  onChangeLanguage(event) {
    if (isNotEmpty((this.model as any).value)) {
      this.onChange(event);
    }
  }

  public hasResultsSelected(): Observable<boolean> {
    return this.model.value.pipe(map((list: Array<SearchResult<DSpaceObject>>) => isNotEmpty(list)));
  }

  /**
   * Open a modal where the user can select relationships to be added to item being submitted
   */
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
    modalComp.collection = this.collection;
  }

  /**
   * Method to move a relationship inside the list of relationships
   * This will update the view and update the right or left place field of the relationships in the list
   * @param event
   */
  moveSelection(event: CdkDragDrop<Relationship>) {
    this.zone.runOutsideAngular(() => {
      moveItemInArray(this.reorderables, event.previousIndex, event.currentIndex);
      const reorderables: Reorderable[] = this.reorderables.map((reo: Reorderable, index: number) => {
          reo.oldIndex = reo.getPlace();
          reo.newIndex = index;
          return reo;
        }
      );
      observableCombineLatest(
        reorderables.map((rel: ReorderableRelationship) => {
          if (rel.oldIndex !== rel.newIndex) {
            return this.relationshipService.updatePlace(rel);
          } else {
            return observableOf(undefined) as Observable<RemoteData<Relationship>>;
          }
        })
      ).subscribe();
    })
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackReorderable(index, reorderable: Reorderable) {
    return hasValue(reorderable) ? reorderable.getId() : undefined;
  }
}
