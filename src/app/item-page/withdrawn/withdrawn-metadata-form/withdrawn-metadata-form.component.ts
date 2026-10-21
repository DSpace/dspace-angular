import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { WithdrawnFieldConfig } from '@dspace/config/withdrawn-item-config.interface';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { resolveWithdrawnFields } from '../item-withdrawn-metadata';

/**
 * The state of the withdrawal form, emitted on every change.
 */
export interface WithdrawnMetadataFormState {
  // Whether every required field has been filled in with a valid value
  valid: boolean;

  // The values to store on the item, by metadata field
  values: { [field: string]: string };
}

/**
 * Form collecting the metadata stored on an item when it is withdrawn: why it has been
 * withdrawn, which record replaces it and whether the reader has to be redirected to the
 * replacement instead of seeing the tombstone page.
 *
 * The fields are driven by the `item.withdrawn.fields` configuration, so that they can be
 * made required or optional, and new ones can be added, without touching this component.
 */
@Component({
  selector: 'ds-withdrawn-metadata-form',
  templateUrl: './withdrawn-metadata-form.component.html',
  styleUrls: ['./withdrawn-metadata-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class WithdrawnMetadataFormComponent implements OnInit {

  /**
   * Emits the state of the form on every change, and once on initialization.
   * It emits asynchronously, so that the initial state does not change the value of a
   * binding the parent has already evaluated in the same change detection run.
   */
  @Output() formChange: EventEmitter<WithdrawnMetadataFormState> = new EventEmitter<WithdrawnMetadataFormState>(true);

  /**
   * The configured fields, in the order they are rendered
   */
  fields: WithdrawnFieldConfig[];

  /**
   * The form holding a control for each configured field
   */
  formGroup: FormGroup;

  constructor(@Inject(APP_CONFIG) protected appConfig: AppConfig) {
  }

  ngOnInit(): void {
    const config = this.appConfig.item.withdrawn;
    this.fields = resolveWithdrawnFields(config?.form, config?.fields);
    this.formGroup = new FormGroup(this.fields.reduce((controls, field) => {
      controls[this.controlName(field)] = new FormControl(
        field.type === 'boolean' ? false : '',
        this.getValidators(field),
      );
      return controls;
    }, {} as { [field: string]: FormControl }));

    this.formGroup.valueChanges.subscribe(() => this.emitState());
    this.emitState();
  }

  /**
   * The name of the control holding the value of the given field.
   *
   * A metadata field cannot be used as is, because a form control name containing dots is
   * read by Angular as a path into nested groups, so the control would never be found.
   */
  controlName(field: WithdrawnFieldConfig): string {
    return field.metadata.replace(/\./g, '_');
  }

  /**
   * The identifier used to bind a label to its input
   */
  controlId(field: WithdrawnFieldConfig): string {
    return `withdrawn-${field.metadata.replace(/\./g, '-')}`;
  }

  /**
   * Whether at least one of the rendered fields is required, so that the meaning of the
   * asterisk marking them is spelled out only when there is an asterisk to explain
   */
  hasRequiredFields(): boolean {
    return this.fields.some((field: WithdrawnFieldConfig) => field.required);
  }

  /**
   * Whether the control of the given field has to show a validation error
   */
  hasError(field: WithdrawnFieldConfig): boolean {
    const control = this.formGroup.get(this.controlName(field));
    return hasValue(control) && control.invalid && (control.dirty || control.touched);
  }

  protected getValidators(field: WithdrawnFieldConfig) {
    const validators = [];
    if (field.required) {
      // a required flag has to be turned on: the item cannot be withdrawn until then
      validators.push(field.type === 'boolean' ? Validators.requiredTrue : Validators.required);
    }
    if (field.type === 'url') {
      validators.push(Validators.pattern(/^https?:\/\/\S+$/i));
    }
    return validators;
  }

  /**
   * Translates the raw form value into the metadata values to store on the item: a boolean
   * field is stored as the "true" string and left out when not checked, so that no useless
   * metadata is added to the item.
   */
  protected emitState(): void {
    const values: { [field: string]: string } = {};
    this.fields.forEach((field: WithdrawnFieldConfig) => {
      const value = this.formGroup.get(this.controlName(field)).value;
      if (field.type === 'boolean') {
        if (value === true) {
          values[field.metadata] = 'true';
        }
      } else if (isNotEmpty(value)) {
        values[field.metadata] = (value as string).trim();
      }
    });

    this.formChange.emit({
      valid: this.formGroup.valid,
      values: values,
    });
  }
}
