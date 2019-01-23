import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MetadataSchema } from '../../../../core/metadata/metadataschema.model';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { Observable } from 'rxjs/internal/Observable';
import { MetadataField } from '../../../../core/metadata/metadatafield.model';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

@Component({
  selector: 'ds-metadata-field-form',
  templateUrl: './metadata-field-form.component.html'
})
export class MetadataFieldFormComponent implements OnInit {

  formId = 'metadata-field-form';
  messagePrefix = 'admin.registries.schema.form';

  @Input() metadataSchema: MetadataSchema;

  element: DynamicInputModel;
  qualifier: DynamicInputModel;
  scopeNote: DynamicInputModel;
  formModel: DynamicFormControlModel[];

  formLayout: DynamicFormLayout = {
    element: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    qualifier: {
      grid: {
        host: 'col col-sm-6 d-inline-block'
      }
    },
    scopeNote: {
      grid: {
        host: 'col col-sm-12 d-inline-block'
      }
    }
  };

  formGroup: FormGroup;

  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor(private registryService: RegistryService,
              private formBuilderService: FormBuilderService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    combineLatest(
      this.translateService.get(`${this.messagePrefix}.element`),
      this.translateService.get(`${this.messagePrefix}.qualifier`),
      this.translateService.get(`${this.messagePrefix}.scopenote`)
    ).subscribe(([element, qualifier, scopenote]) => {
      this.element = new DynamicInputModel({
        id: 'element',
        label: element,
        name: 'element',
        validators: {
          required: null,
        },
        required: true,
      });
      this.qualifier = new DynamicInputModel({
        id: 'qualifier',
        label: qualifier,
        name: 'qualifier',
        required: false,
      });
      this.scopeNote = new DynamicInputModel({
        id: 'scopeNote',
        label: scopenote,
        name: 'scopeNote',
        required: false,
      });
      this.formModel = [
        this.element,
        this.qualifier,
        this.scopeNote
      ];
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      this.registryService.getActiveMetadataField().subscribe((field) => {
        this.formGroup.patchValue({
            field: {
              element: field != null ? field.element : '',
              qualifier: field != null ? field.qualifier : '',
              scopeNote: field != null ? field.scopeNote : ''
            }
          }
        );
      });
    });
  }

  onCancel() {
    this.registryService.cancelEditMetadataField();
  }

  onSubmit() {
    this.registryService.getActiveMetadataField().pipe(take(1)).subscribe(
      (field) => {
        const values = {
          schema: this.metadataSchema,
          element: this.element.value,
          qualifier: this.qualifier.value,
          scopeNote: this.scopeNote.value
        };
        if (field == null) {
          this.registryService.createOrUpdateMetadataField(Object.assign(new MetadataField(), values)).subscribe((newField) => {
            this.submitForm.emit(newField);
          });
        } else {
          this.registryService.createOrUpdateMetadataField(Object.assign(new MetadataField(), {
            id: field.id,
            schema: this.metadataSchema,
            element: (values.element ? values.element : field.element),
            qualifier: (values.qualifier ? values.qualifier : field.qualifier),
            scopeNote: (values.scopeNote ? values.scopeNote : field.scopeNote)
          })).subscribe((updatedField) => {
            this.submitForm.emit(updatedField);
          });
        }
      }
    );
  }
}
