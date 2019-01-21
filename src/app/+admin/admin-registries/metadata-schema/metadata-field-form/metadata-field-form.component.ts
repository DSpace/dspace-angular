import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MetadataSchema } from '../../../../core/metadata/metadataschema.model';
import { DynamicFormControlModel, DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { Observable } from 'rxjs/internal/Observable';
import { MetadataField } from '../../../../core/metadata/metadatafield.model';

@Component({
  selector: 'ds-metadata-field-form',
  templateUrl: './metadata-field-form.component.html',
  // styleUrls: ['./metadata-field-form.component.css']
})
export class MetadataFieldFormComponent implements OnInit {

  formId = 'metadata-field-form';

  @Input() metadataSchema: MetadataSchema;

  private element: DynamicInputModel = new DynamicInputModel({
    id: 'element',
    label: 'element',
    name: 'element',
    validators: {
      required: null,
    },
    required: false,
  });
  private qualifier: DynamicInputModel = new DynamicInputModel({
    id: 'qualifier',
    label: 'qualifier',
    name: 'qualifier',
    required: false,
  });
  private scopeNote: DynamicInputModel = new DynamicInputModel({
    id: 'scopeNote',
    label: 'scopeNote',
    name: 'scopeNote',
    required: false,
  });

  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'field',
      legend: 'field',
      group: [
        this.element,
        this.qualifier,
        this.scopeNote
      ]
    })
  ];

  formGroup: FormGroup;

  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor(private registryService: RegistryService, private formBuilderService: FormBuilderService) {
  }

  ngOnInit() {

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
  }

  getMetadataField(): Observable<MetadataField> {
    return this.registryService.getActiveMetadataField();
  }

  onCancel() {
    this.registryService.cancelEditMetadataField();
  }

  onSubmit() {
    this.registryService.getActiveMetadataField().subscribe(
      (field) => {

        if (field == null) {
          console.log('metadata field to create:');
          console.log('element: ' + this.element.value);
          if (this.qualifier.value) {
            console.log('qualifier: ' + this.qualifier.value);
          }
          if (this.scopeNote.value) {
            console.log('scopeNote: ' + this.scopeNote.value);
          }
        } else {
          console.log('metadata field to update:');
          console.log('element: ' + this.element.value);
          if (this.qualifier.value) {
            console.log('qualifier: ' + this.qualifier.value);
          }
          if (this.scopeNote.value) {
            console.log('scopeNote: ' + this.scopeNote.value);
          }
        }
      }
    );
  }
}
