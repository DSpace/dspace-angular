import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
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
  DynamicDatePickerModel,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormControlRelationGroup,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
  RelationUtils,
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

import { DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD } from './models/typeahead/dynamic-typeahead.model';
import { DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './models/tag/dynamic-tag.model';
import { DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER } from './models/date-picker/date-picker.model';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP } from './models/lookup/dynamic-lookup.model';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';
import { isNotEmpty, isNotUndefined } from '../../../empty.util';
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
import { DsDynamicTypeBindRelationService } from './ds-dynamic-type-bind-relation.service';
import { distinctUntilChanged } from 'rxjs/operators';

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
export class DsDynamicFormControlContainerComponent extends DynamicFormControlContainerComponent implements OnChanges {

  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
  // tslint:disable-next-line:no-input-rename
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() formId: string;
  @Input() formGroup: FormGroup;
  @Input() formModel: DynamicFormControlModel[];
  @Input() asBootstrapFormGroup = true;
  @Input() bindId = true;
  @Input() context: any | null = null;
  @Input() group: FormGroup;
  @Input() hasErrorMessaging = false;
  @Input() layout = null as DynamicFormLayout;
  @Input() model: any;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* tslint:enable:no-output-rename */
  @ViewChild('componentViewContainer', {read: ViewContainerRef}) componentViewContainerRef: ViewContainerRef;

  private showErrorMessagesPreviousStage: boolean;

  get componentType(): Type<DynamicFormControl> | null {
    return this.layoutService.getCustomComponentType(this.model) || dsDynamicFormControlMapFn(this.model);
  }

  protected test: boolean;
  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected translateService: TranslateService,
    protected typeBindRelationService: DsDynamicTypeBindRelationService,
  ) {

    super(componentFactoryResolver, layoutService, validationService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      super.ngOnChanges(changes);
      if (this.model && this.model.placeholder) {
        this.model.placeholder = this.translateService.instant(this.model.placeholder);
      }

      if (this.model.typeBind && this.model.typeBind.length > 0) {
        this.setControlTypeBindRelations();
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

  protected setControlTypeBindRelations(): void {

    const typeBindRelActivation = RelationUtils.findActivationRelation(this.model.typeBind);

    if (typeBindRelActivation !== null) {

      const rel = typeBindRelActivation as DynamicFormControlRelationGroup;

      this.updateModelHidden(rel);

      this.typeBindRelationService.getRelatedFormModel(this.model)
        .forEach((model: any) => {

          this.subscriptions.push(
            model.valueUpdates.pipe(
              distinctUntilChanged()
            ).subscribe(() => {
              this.updateModelHidden(typeBindRelActivation);
            })
          );
        });
    }
  }

  updateModelHidden(relation: DynamicFormControlRelationGroup): void {
    this.model.disabledUpdates.next(this.typeBindRelationService.isFormControlToBeHidden(relation));
    this.model.hiddenUpdates.next(this.typeBindRelationService.isFormControlToBeHidden(relation));
  }

  protected createFormControlComponent(): void {

    const componentType = this.componentType;

    if (componentType !== null) {

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

      this.componentViewContainerRef.clear();
      this.componentRef = this.componentViewContainerRef.createComponent(componentFactory);

      const instance = this.componentRef.instance;

      instance.bindId = this.bindId;
      instance.group = this.group;
      instance.layout = this.layout;
      instance.model = this.model as any;
      (instance as any).formModel = this.formModel;
      (instance as any).formGroup = this.formGroup;

      if (this.templates) {
        instance.templates = this.templates;
      }

      this.componentSubscriptions.push(instance.blur.subscribe(($event: any) => this.onBlur($event)));
      this.componentSubscriptions.push(instance.change.subscribe(($event: any) => this.onChange($event)));
      this.componentSubscriptions.push(instance.focus.subscribe(($event: any) => this.onFocus($event)));

      if (instance.customEvent !== undefined) {
        this.componentSubscriptions.push(
          instance.customEvent.subscribe(($event: any) => this.onCustomEvent($event)));
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
}
