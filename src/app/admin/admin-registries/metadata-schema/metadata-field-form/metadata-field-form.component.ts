import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicInputModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { MetadataField } from '../../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../../shared/form/form.component';

@Component({
  selector: 'ds-metadata-field-form',
  templateUrl: './metadata-field-form.component.html',
  imports: [
    NgIf,
    FormComponent,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true,
})
/**
 * A form used for creating and editing metadata fields
 */
export class MetadataFieldFormComponent implements OnInit, OnDestroy {

  /**
   * A unique id used for ds-form
   */
  formId = 'metadata-field-form';

  /**
   * The prefix for all messages related to this form
   */
  messagePrefix = 'admin.registries.schema.form';

  /**
   * The metadata schema this field is attached to
   */
  @Input() metadataSchema: MetadataSchema;

  /**
   * A dynamic input model for the element field
   */
  element: DynamicInputModel;

  /**
   * A dynamic input model for the qualifier field
   */
  qualifier: DynamicInputModel;

  /**
   * A dynamic input model for the scopeNote field
   */
  scopeNote: DynamicTextAreaModel;

  /**
   * A list of all dynamic input models
   */
  formModel: DynamicFormControlModel[];

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    element: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
      },
    },
    qualifier: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
      },
    },
    scopeNote: {
      grid: {
        host: 'col col-sm-12 d-inline-block',
      },
    },
  };

  /**
   * A FormGroup that combines all inputs
   */
  formGroup: UntypedFormGroup;

  /**
   * An EventEmitter that's fired whenever the form is being submitted
   */
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor(public registryService: RegistryService,
              private formBuilderService: FormBuilderService,
              private translateService: TranslateService) {
  }

  /**
   * Initialize the component, setting up the necessary Models for the dynamic form
   */
  ngOnInit() {
    combineLatest([
      this.translateService.get(`${this.messagePrefix}.element`),
      this.translateService.get(`${this.messagePrefix}.qualifier`),
      this.translateService.get(`${this.messagePrefix}.scopenote`),
    ]).subscribe(([element, qualifier, scopenote]) => {
      this.element = new DynamicInputModel({
        id: 'element',
        label: element,
        name: 'element',
        validators: {
          required: null,
          pattern: '^[^. ,]*$',
          maxLength: 64,
        },
        required: true,
        errorMessages: {
          pattern: 'error.validation.metadata.element.invalid-pattern',
          maxLength: 'error.validation.metadata.element.max-length',
        },
      });
      this.qualifier = new DynamicInputModel({
        id: 'qualifier',
        label: qualifier,
        name: 'qualifier',
        validators: {
          pattern: '^[^. ,]*$',
          maxLength: 64,
        },
        required: false,
        errorMessages: {
          pattern: 'error.validation.metadata.qualifier.invalid-pattern',
          maxLength: 'error.validation.metadata.qualifier.max-length',
        },
      });
      this.scopeNote = new DynamicTextAreaModel({
        id: 'scopeNote',
        label: scopenote,
        name: 'scopeNote',
        required: false,
        rows: 5,
      });
      this.formModel = [
        new DynamicFormGroupModel(
          {
            id: 'metadatadatafieldgroup',
            group:[this.element, this.qualifier, this.scopeNote],
          }),
      ];
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      this.registryService.getActiveMetadataField().subscribe((field: MetadataField): void => {
        if (field == null) {
          this.clearFields();
        } else {
          this.formGroup.patchValue({
            metadatadatafieldgroup: {
              element: field.element,
              qualifier: field.qualifier,
              scopeNote: field.scopeNote,
            },
          });
          this.element.disabled = true;
          this.qualifier.disabled = true;
        }
      });
    });
  }

  /**
   * Stop editing the currently selected metadata field
   */
  onCancel() {
    this.registryService.cancelEditMetadataField();
  }

  /**
   * Submit the form
   * When the field has an id attached -> Edit the field
   * When the field has no id attached -> Create new field
   * Emit the updated/created field using the EventEmitter submitForm
   */
  onSubmit(): void {
    this.registryService.getActiveMetadataField().pipe(take(1)).subscribe(
      (field: MetadataField) => {
        if (field == null) {
          this.registryService.createMetadataField(Object.assign(new MetadataField(), {
            element: this.element.value,
            qualifier: this.qualifier.value,
            scopeNote: this.scopeNote.value,
          }), this.metadataSchema).subscribe((newField: MetadataField) => {
            this.submitForm.emit(newField);
          });
        } else {
          this.registryService.updateMetadataField(Object.assign(new MetadataField(), field, {
            id: field.id,
            element: field.element,
            qualifier: field.qualifier,
            scopeNote: this.scopeNote.value,
          })).subscribe((updatedField: MetadataField) => {
            this.submitForm.emit(updatedField);
          });
        }
        this.clearFields();
        this.registryService.cancelEditMetadataField();
      },
    );
  }

  /**
   * Reset all input-fields to be empty
   */
  clearFields(): void {
    this.formGroup.reset('metadatadatafieldgroup');
    this.element.disabled = false;
    this.qualifier.disabled = false;
  }

  /**
   * Cancel the current edit when component is destroyed
   */
  ngOnDestroy(): void {
    this.onCancel();
  }
}
