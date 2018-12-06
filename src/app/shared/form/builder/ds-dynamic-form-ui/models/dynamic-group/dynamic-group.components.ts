import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { filter, flatMap, map, mergeMap, scan } from 'rxjs/operators';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { isEqual, isObject } from 'lodash';

import { DynamicGroupModel, PLACEHOLDER_PARENT_METADATA } from './dynamic-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import { SubmissionFormsModel } from '../../../../../../core/config/models/config-submission-forms.model';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { Chips } from '../../../../../chips/models/chips.model';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../empty.util';
import { shrinkInOut } from '../../../../../animations/shrink';
import { ChipsItem } from '../../../../../chips/models/chips-item.model';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { hasOnlyEmptyProperties } from '../../../../../object.util';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';

@Component({
  selector: 'ds-dynamic-group',
  styleUrls: ['./dynamic-group.component.scss'],
  templateUrl: './dynamic-group.component.html',
  animations: [shrinkInOut]
})
export class DsDynamicGroupComponent implements OnDestroy, OnInit {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicGroupModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public chips: Chips;
  public formCollapsed = Observable.of(false);
  public formModel: DynamicFormControlModel[];
  public editMode = false;

  private selectedChipItem: ChipsItem;
  private subs: Subscription[] = [];

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private authorityService: AuthorityService,
              private formBuilderService: FormBuilderService,
              private formService: FormService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const config = {rows: this.model.formConfiguration} as SubmissionFormsModel;
    if (!this.model.isEmpty()) {
      this.formCollapsed = Observable.of(true);
    }
    this.model.valueUpdates.subscribe((value: any[]) => {
      if ((isNotEmpty(value) && !(value.length === 1 && hasOnlyEmptyProperties(value[0])))) {
        this.collapseForm();
      } else {
        this.expandForm();
      }
    });

    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.formBuilderService.modelFromConfiguration(
      config,
      this.model.scopeUUID,
      {},
      this.model.submissionScope,
      this.model.readOnly);
    this.initChipsFromModelValue();
  }

  isMandatoryFieldEmpty() {
    let res = true;
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        if (model.name === this.model.mandatoryField) {
          res = model.value == null;
          return;
        }
      });
    });
    return res;
  }

  onBlur(event) {
    this.blur.emit();
  }

  onChipSelected(event) {
    this.expandForm();
    this.selectedChipItem = this.chips.getChipByIndex(event);
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        const value = (this.selectedChipItem.item[model.name] === PLACEHOLDER_PARENT_METADATA
          || this.selectedChipItem.item[model.name].value === PLACEHOLDER_PARENT_METADATA)
          ? null
          : this.selectedChipItem.item[model.name];
        model.valueUpdates.next(value);
      });
    });

    this.editMode = true;
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  collapseForm() {
    this.formCollapsed = Observable.of(true);
    this.clear();
  }

  expandForm() {
    this.formCollapsed = Observable.of(false);
  }

  clear() {
    if (this.editMode) {
      this.selectedChipItem.editMode = false;
      this.selectedChipItem = null;
      this.editMode = false;
    }
    this.resetForm();
    if (!this.model.isEmpty()) {
      this.formCollapsed = Observable.of(true);
    }
  }

  save() {
    if (this.editMode) {
      this.modifyChip();
    } else {
      this.addToChips();
    }
  }

  delete() {
    this.chips.remove(this.selectedChipItem);
    this.clear();
  }

  private addToChips() {
    if (!this.formRef.formGroup.valid) {
      this.formService.validateAllFormFields(this.formRef.formGroup);
      return;
    }

    // Item to add
    if (!this.isMandatoryFieldEmpty()) {
      const item = this.buildChipItem();
      this.chips.add(item);

      this.resetForm();
    }
  }

  private modifyChip() {
    if (!this.formRef.formGroup.valid) {
      this.formService.validateAllFormFields(this.formRef.formGroup);
      return;
    }

    if (!this.isMandatoryFieldEmpty()) {
      const item = this.buildChipItem();
      this.chips.update(this.selectedChipItem.id, item);
      this.resetForm();
      this.cdr.detectChanges();
    }
  }

  private buildChipItem() {
    const item = Object.create({});
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((control: DynamicInputModel) => {
        item[control.name] = control.value || PLACEHOLDER_PARENT_METADATA;
      });
    });
    return item;
  }

  private initChipsFromModelValue() {

    let initChipsValue$: Observable<any[]>;
    if (this.model.isEmpty()) {
      this.initChips([]);
    } else {
      initChipsValue$ = Observable.of(this.model.value);

      // If authority
      this.subs.push(initChipsValue$.pipe(
        flatMap((valueModel) => {
          const returnList: Array<Observable<any>> = [];
          valueModel.forEach((valueObj) => {
            let returnObj = Object.create({});
            returnObj = Object.keys(valueObj).map((fieldName) => {
              let return$: Observable<any>;
              if (isObject(valueObj[fieldName]) && valueObj[fieldName].hasAuthority() && isNotEmpty(valueObj[fieldName].authority)) {
                const fieldId = fieldName.replace(/\./g, '_');
                const model = this.formBuilderService.findById(fieldId, this.formModel);
                const searchOptions: IntegrationSearchOptions = new IntegrationSearchOptions(
                  (model as any).authorityOptions.scope,
                  (model as any).authorityOptions.name,
                  (model as any).authorityOptions.metadata,
                  valueObj[fieldName].authority,
                  (model as any).maxOptions,
                  1);

                return$ = this.authorityService.getEntryByValue(searchOptions)
                  .map((result: IntegrationData) => Object.assign(
                    new FormFieldMetadataValueObject(),
                    valueObj[fieldName],
                    {
                      otherInformation: (result.payload[0] as AuthorityValue).otherInformation
                    })
                  );
              } else {
                return$ = Observable.of(valueObj[fieldName]);
              }
              return return$.map((entry) => ({[fieldName]: entry}));
            });

            returnList.push(Observable.combineLatest(returnObj));
          });
          return returnList;
        }),
        mergeMap((valueListObj: Observable<any>, index: number) => {
          return valueListObj.pipe(
            map((valueObj: any) => ({
                index: index, value: valueObj.reduce(
                (acc: any, value: any) => Object.assign({}, acc, value)
                )
              })
            )
          )
        }),
        scan((acc: any[], valueObj: any) => {
          if (acc.length === 0) {
            acc.push(valueObj.value);
          } else {
            acc.splice(valueObj.index, 0, valueObj.value);
          }
          return acc;
        }, []),
        filter((modelValues: any[]) => this.model.value.length === modelValues.length)
      ).subscribe((modelValue) => {
        this.model.valueUpdates.next(modelValue);
        this.initChips(modelValue);
      }));
    }
  }

  private initChips(initChipsValue) {
    this.chips = new Chips(
      initChipsValue,
      'value',
      this.model.mandatoryField,
      this.EnvConfig.submission.icons.metadata);
    this.subs.push(
      this.chips.chipsItems
        .subscribe((subItems: any[]) => {
          const items = this.chips.getChipsItems();
          // Does not emit change if model value is equal to the current value
          if (!isEqual(items, this.model.value)) {
            if (!(isEmpty(items) && this.model.isEmpty())) {
              this.model.valueUpdates.next(items);
              this.change.emit();
            }
          }
        }),
    )
  }

  private resetForm() {
    if (this.formRef) {
      this.formService.resetForm(this.formRef.formGroup, this.formModel, this.formId);
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
