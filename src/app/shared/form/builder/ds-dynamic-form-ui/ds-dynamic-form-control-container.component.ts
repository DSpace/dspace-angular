import {
  AsyncPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import {
  NgbModal,
  NgbModalRef,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormComponentService,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlEventType,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormRelationService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import { DynamicFormControlMapFn } from '@ng-dynamic-forms/core/lib/service/dynamic-form-component.service';
import { Store } from '@ngrx/store';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  find,
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { AppState } from '../../../../app.reducer';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { MetadataService } from '../../../../core/metadata/metadata.service';
import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import {
  MetadataValue,
  VIRTUAL_METADATA_PREFIX,
} from '../../../../core/shared/metadata.models';
import {
  getAllSucceededRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getPaginatedListPayload,
  getRemoteDataPayload,
} from '../../../../core/shared/operators';
import { SubmissionObject } from '../../../../core/submission/models/submission-object.model';
import { SUBMISSION_LINKS_TO_FOLLOW } from '../../../../core/submission/resolver/submission-links-to-follow';
import { SubmissionObjectDataService } from '../../../../core/submission/submission-object-data.service';
import { paginatedRelationsToItems } from '../../../../item-page/simple/item-types/shared/item-relationships-utils';
import { SubmissionService } from '../../../../submission/submission.service';
import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
  isNotUndefined,
} from '../../../empty.util';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { SelectableListState } from '../../../object-list/selectable-list/selectable-list.reducer';
import { SelectableListService } from '../../../object-list/selectable-list/selectable-list.service';
import { SearchResult } from '../../../search/models/search-result.model';
import { followLink } from '../../../utils/follow-link-config.model';
import { itemLinksToFollow } from '../../../utils/relation-query.utils';
import { FormBuilderService } from '../form-builder.service';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { RelationshipOptions } from '../models/relationship-options.model';
import { DsDynamicTypeBindRelationService } from './ds-dynamic-type-bind-relation.service';
import {
  ExistingMetadataListElementComponent,
  ReorderableRelationship,
} from './existing-metadata-list-element/existing-metadata-list-element.component';
import { ExistingRelationListElementComponent } from './existing-relation-list-element/existing-relation-list-element.component';
import { DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH } from './models/custom-switch/custom-switch.model';
import { DsDynamicLookupRelationModalComponent } from './relation-lookup-modal/dynamic-lookup-relation-modal.component';

@Component({
  selector: 'ds-dynamic-form-control-container',
  styleUrls: ['./ds-dynamic-form-control-container.component.scss'],
  templateUrl: './ds-dynamic-form-control-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ExistingMetadataListElementComponent,
    ExistingRelationListElementComponent,
    FormsModule,
    NgbTooltipModule,
    NgClass,
    NgTemplateOutlet,
    ReactiveFormsModule,
    TranslateModule,
  ],
  standalone: true,
})
export class DsDynamicFormControlContainerComponent extends DynamicFormControlContainerComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit, DoCheck {
  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;
  @Input() hasMetadataModel: any;
  @Input() formId: string;
  @Input() formGroup: UntypedFormGroup;
  @Input() formModel: DynamicFormControlModel[];
  @Input() asBootstrapFormGroup = false;
  @Input() bindId = true;
  @Input() context: any = null;
  @Input() group: UntypedFormGroup;
  @Input() hostClass: string[];
  @Input() hasErrorMessaging = false;
  @Input() layout = null as DynamicFormLayout;
  @Input() model: any;
  relationshipValue$: Observable<ReorderableRelationship>;
  isRelationship: boolean;
  modalRef: NgbModalRef;
  item: Item;
  item$: Observable<Item>;
  collection: Collection;
  listId: string;
  searchConfig: string;
  value: MetadataValue;
  /**
   * List of subscriptions to unsubscribe from
   */
  private subs: Subscription[] = [];

  /* eslint-disable @angular-eslint/no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* eslint-enable @angular-eslint/no-output-rename */
  @ViewChild('componentViewContainer', { read: ViewContainerRef, static: true }) componentViewContainerRef: ViewContainerRef;

  private showErrorMessagesPreviousStage: boolean;

  /**
   * Determines whether to request embedded thumbnail.
   */
  fetchThumbnail: boolean;

  get componentType(): Type<DynamicFormControl> | null {
    return this.dynamicFormControlFn(this.model);
  }

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected dynamicFormComponentService: DynamicFormComponentService,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected typeBindRelationService: DsDynamicTypeBindRelationService,
    protected translateService: TranslateService,
    protected relationService: DynamicFormRelationService,
    protected modalService: NgbModal,
    protected relationshipService: RelationshipDataService,
    protected selectableListService: SelectableListService,
    protected store: Store<AppState>,
    protected submissionObjectService: SubmissionObjectDataService,
    protected ref: ChangeDetectorRef,
    protected formBuilderService: FormBuilderService,
    protected submissionService: SubmissionService,
    protected metadataService: MetadataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    @Inject(DYNAMIC_FORM_CONTROL_MAP_FN) protected dynamicFormControlFn: DynamicFormControlMapFn,
  ) {
    super(ref, componentFactoryResolver, layoutService, validationService, dynamicFormComponentService, relationService);
    this.fetchThumbnail = this.appConfig.browseBy.showThumbnails;
  }

  /**
   * Sets up the necessary variables for when this control can be used to add relationships to the submitted item
   */
  ngOnInit(): void {
    this.isRelationship = hasValue(this.model.relationship);
    const isWrapperAroundRelationshipList = hasValue(this.model.relationshipConfig);

    if (this.isRelationship || isWrapperAroundRelationshipList) {
      const config = this.model.relationshipConfig || this.model.relationship;
      const relationshipOptions = Object.assign(new RelationshipOptions(), config);
      this.listId = `list-${this.model.submissionId}-${relationshipOptions.relationshipType}`;
      this.setItem();

      if (isWrapperAroundRelationshipList || !this.model.repeatable) {
        const subscription = this.selectableListService.getSelectableList(this.listId).pipe(
          find((list: SelectableListState) => hasNoValue(list)),
          switchMap(() => this.item$.pipe(take(1))),
          switchMap((item) => {
            const relationshipsRD$ = this.relationshipService.getItemRelationshipsByLabel(item,
              relationshipOptions.relationshipType,
              undefined,
              true,
              true,
              followLink('leftItem'),
              followLink('rightItem'),
              followLink('relationshipType'),
            );
            relationshipsRD$.pipe(
              getFirstSucceededRemoteDataPayload(),
              getPaginatedListPayload(),
            ).subscribe((relationships: Relationship[]) => {
              // set initial namevariants for pre-existing relationships
              relationships.forEach((relationship: Relationship) => {
                const relationshipMD: MetadataValue = item.firstMetadata(relationshipOptions.metadataField, { authority: `${VIRTUAL_METADATA_PREFIX}${relationship.id}` });
                const nameVariantMD: MetadataValue = item.firstMetadata(this.model.metadataFields, { authority: `${VIRTUAL_METADATA_PREFIX}${relationship.id}` });
                if (hasValue(relationshipMD) && isNotEmpty(relationshipMD.value) && hasValue(nameVariantMD) && isNotEmpty(nameVariantMD.value)) {
                  this.relationshipService.setNameVariant(this.listId, relationshipMD.value, nameVariantMD.value);
                }
              });
            });

            return relationshipsRD$.pipe(
              paginatedRelationsToItems(item.uuid),
              getFirstSucceededRemoteData(),
              map((items: RemoteData<PaginatedList<Item>>) => items.payload.page.map((i) => Object.assign(new ItemSearchResult(), { indexableObject: i }))),
            );
          }),
        ).subscribe((relatedItems: SearchResult<Item>[]) => this.selectableListService.select(this.listId, relatedItems));
        this.subs.push(subscription);
      }

      if (hasValue(this.model.metadataValue)) {
        this.value = Object.assign(new FormFieldMetadataValueObject(), this.model.metadataValue);
      } else {
        this.value = Object.assign(new FormFieldMetadataValueObject(), this.model.value);
      }

      if (hasValue(this.value) && this.metadataService.isVirtual(this.value)) {
        const relationship$ = this.relationshipService.findById(this.metadataService.virtualValue(this.value),
          true,
          true,
          ... itemLinksToFollow(this.fetchThumbnail, this.appConfig.item.showAccessStatuses)).pipe(
          getAllSucceededRemoteData(),
          getRemoteDataPayload());
        this.relationshipValue$ = observableCombineLatest([this.item$.pipe(take(1)), relationship$]).pipe(
          switchMap(([item, relationship]: [Item, Relationship]) =>
            relationship.leftItem.pipe(
              getAllSucceededRemoteData(),
              getRemoteDataPayload(),
              map((leftItem: Item) => {
                return new ReorderableRelationship(relationship, leftItem.uuid !== item.uuid, this.store, this.model.submissionId);
              }),
            ),
          ),
          startWith(undefined),
        );
      }
    }
  }

  get isCheckbox(): boolean {
    return this.model.type === DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX || this.model.type === DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && !this.isRelationship && hasValue(this.group.get(this.model.id))) {
      super.ngOnChanges(changes);
      if (this.model && this.model.placeholder) {
        this.model.placeholder = this.translateService.instant(this.model.placeholder);
      }
      if (this.model.typeBindRelations && this.model.typeBindRelations.length > 0) {
        this.subscriptions.push(...this.typeBindRelationService.subscribeRelations(this.model, this.control));
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

  protected createFormControlComponent(): void {
    super.createFormControlComponent();
    if (this.componentType !== null) {
      let index;

      if (this.context && this.context instanceof DynamicFormArrayGroupModel) {
        index = this.context.index;
      }
      const instance = this.dynamicFormComponentService.getFormControlRef(this.model, index);
      if (instance) {
        (instance as any).formModel = this.formModel;
        (instance as any).formGroup = this.formGroup;
      }
    }
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

  hasRelationship() {
    return isNotEmpty(this.model) && this.model.hasOwnProperty('relationship') && isNotEmpty(this.model.relationship);
  }

  isVirtual() {
    const value: FormFieldMetadataValueObject = this.model.metadataValue;
    return isNotEmpty(value) && value.isVirtual;
  }

  public hasResultsSelected(): Observable<boolean> {
    return this.model.value.pipe(map((list: SearchResult<DSpaceObject>[]) => isNotEmpty(list)));
  }

  /**
   * Open a modal where the user can select relationships to be added to item being submitted
   */
  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent, {
      size: 'lg',
    });

    if (hasValue(this.model.value)) {
      this.focus.emit({
        $event: new Event('focus'),
        context: this.context,
        control: this.control,
        model: this.model,
        type: DynamicFormControlEventType.Focus,
      } as DynamicFormControlEvent);

      this.change.emit({
        $event: new Event('change'),
        context: this.context,
        control: this.control,
        model: this.model,
        type: DynamicFormControlEventType.Change,
      } as DynamicFormControlEvent);
    }

    this.submissionService.dispatchSave(this.model.submissionId);

    const modalComp = this.modalRef.componentInstance;

    if (hasValue(this.model.value) && !this.model.readOnly) {
      if (typeof this.model.value === 'string') {
        modalComp.query = this.model.value;
      } else if (typeof this.model.value.value === 'string') {
        modalComp.query = this.model.value.value;
      }
    }

    modalComp.repeatable = this.model.repeatable;
    modalComp.listId = this.listId;
    modalComp.relationshipOptions = this.model.relationship;
    modalComp.label = this.model.relationship.relationshipType;
    modalComp.metadataFields = this.model.metadataFields;
    modalComp.item = this.item;
    modalComp.collection = this.collection;
    modalComp.submissionId = this.model.submissionId;
  }

  /**
   * Callback for the remove event,
   * remove the current control from its array
   */
  onRemove(): void {
    const arrayContext: DynamicFormArrayModel = (this.context as DynamicFormArrayGroupModel).context;
    const path = this.formBuilderService.getPath(arrayContext);
    const formArrayControl = this.group.root.get(path) as UntypedFormArray;
    this.formBuilderService.removeFormArrayGroup(this.context.index, formArrayControl, arrayContext);
    if (this.model.parent.context.groups.length === 0) {
      this.formBuilderService.addFormArrayGroup(formArrayControl, arrayContext);
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

  get hasHint(): boolean {
    return isNotEmpty(this.model.hint) && this.model.hint !== '&nbsp;';
  }

  /**
   *  Initialize this.item$ based on this.model.submissionId
   */
  private setItem() {
    const submissionObject$ = this.submissionObjectService
      .findById(this.model.submissionId, true, true, ...SUBMISSION_LINKS_TO_FOLLOW).pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
      );

    this.item$ = submissionObject$.pipe(switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));
    const collection$ = submissionObject$.pipe(switchMap((submissionObject: SubmissionObject) => (submissionObject.collection as Observable<RemoteData<Collection>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));

    this.subs.push(this.item$.subscribe((item) => this.item = item));
    this.subs.push(collection$.subscribe((collection) => this.collection = collection));

  }
}
