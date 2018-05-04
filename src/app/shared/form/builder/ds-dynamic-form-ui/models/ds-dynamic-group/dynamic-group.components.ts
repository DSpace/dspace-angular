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

import { Observable } from 'rxjs/Observable';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { isEqual } from 'lodash';

import { DynamicGroupModel, PLACEHOLDER_PARENT_METADATA } from './dynamic-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import { SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { Chips } from '../../../../../chips/models/chips.model';
import { DynamicLookupModel } from '../lookup/dynamic-lookup.model';
import { NotificationsService } from '../../../../../notifications/notifications.service';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../empty.util';
import { shrinkInOut } from '../../../../../animations/shrink';
import { ChipsItem } from '../../../../../chips/models/chips-item.model';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

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

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public chips: Chips;
  public formCollapsed = Observable.of(false);
  public formModel: DynamicFormControlModel[];
  public editMode = false;
  public invalid = false;

  private selectedChipItem: ChipsItem;
  private subs: Subscription[] = [];

  @ViewChild('formRef') private formRef: FormComponent;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private formBuilderService: FormBuilderService,
              private formService: FormService,
              private notificationService: NotificationsService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log(this.model.hasErrorMessages);
    const config = {rows: this.model.formConfiguration} as SubmissionFormsModel;
    if (isNotEmpty(this.model.value)) {
      this.formCollapsed = Observable.of(true);
    }
    this.formId = this.formService.getUniqueId(this.model.id);
    this.formModel = this.formBuilderService.modelFromConfiguration(config, this.model.scopeUUID, {});
    this.chips = new Chips(this.EnvConfig, this.model.value, 'value', this.model.mandatoryField);
    this.subs.push(
      this.chips.chipsItems
        .subscribe((subItems: any[]) => {
          const items = this.chips.getChipsItems();
          // Does not emit change if model value is equal to the current value
          if (!isEqual(items, this.model.value)) {
            if (isEmpty(items)) {
              // If items is empty, last element has been removed
              // so emit an empty value that allows to dispatch
              // a remove JSON PATCH operation
              const emptyItem = Object.create({});
              Object.keys(this.model.value[0])
                .forEach((key) => {
                  emptyItem[key] = null;
                });
              items.push(emptyItem);
            }

            this.model.valueUpdates.next(items);
            this.change.emit();
          }
        }),
      // Invalid state for year
      this.group.get(this.model.id).statusChanges.subscribe((state) => {
        if (state === 'INVALID') {
          this.invalid = true;
        } else {
          this.invalid = false;
        }
      })
    )
  }

  isMandatoryFieldEmpty() {
    // formModel[0].group[0].value == null
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

  onChipSelected(event) {
    this.expandForm();
    this.selectedChipItem = this.chips.getChipByIndex(event);
    this.formModel.forEach((row) => {
      const modelRow = row as DynamicFormGroupModel;
      modelRow.group.forEach((model: DynamicInputModel) => {
        const value = this.selectedChipItem.item[model.name] === PLACEHOLDER_PARENT_METADATA ? null : this.selectedChipItem.item[model.name];
        if (model instanceof DynamicLookupModel) {
          (model as DynamicLookupModel).valueUpdates.next(value);
        } else if (model instanceof DynamicInputModel) {
          model.valueUpdates.next(value);
        } else {
          (model as any).value = value;
        }
      });
    });

    this.editMode = true;
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
    // this.change.emit(event);
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
      // this.notificationService.warning(null, 'Please compile the mandatory field before to save.');
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

  private resetForm() {
    this.formService.resetForm(this.formRef.formGroup, this.formModel, this.formId);
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
