import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { take } from 'rxjs/operators';
import { MetadataSchema } from '../../../../core/metadata/metadataschema.model';

@Component({
  selector: 'ds-metadata-schema-form',
  templateUrl: './metadata-schema-form.component.html'
})
export class MetadataSchemaFormComponent implements OnInit {

  formId = 'metadata-schema-form';

  private name: DynamicInputModel = new DynamicInputModel({
    id: 'name',
    label: 'name',
    name: 'name',
    validators: {
      required: null,
      pattern: '^[^ ,_]{1,32}$'
    },
    required: true,
  });
  private namespace: DynamicInputModel = new DynamicInputModel({
      id: 'namespace',
      label: 'namespace',
      name: 'namespace',
      validators: {
        required: null,
      },
      required: true,
    });

  formModel: DynamicFormControlModel[] = [
    new DynamicFormGroupModel({
      id: 'schema',
      legend: 'schema',
      group: [
        this.namespace,
        this.name
      ]
    })
  ];

  formLayout: DynamicFormLayout = {
    name: {
      grid: {
        control: 'col col-sm-5',
        label: 'col col-sm-5'
      }
    },
    namespace: {
      grid: {
        control: 'col col-sm-5',
        label: 'col col-sm-5'
      }
    }
  };

  formGroup: FormGroup;

  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor(private registryService: RegistryService, private formBuilderService: FormBuilderService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.registryService.getActiveMetadataSchema().subscribe((schema) => {
      this.formGroup.patchValue({
          schema: {
            name: schema != null ? schema.prefix : '',
            namespace: schema != null ? schema.namespace : ''
          }
        }
      );
    });
  }

  onCancel() {
    this.registryService.cancelEditMetadataSchema();
  }

  onSubmit() {
    this.registryService.getActiveMetadataSchema().pipe(take(1)).subscribe(
      (schema) => {
        const values = {
          prefix: this.name.value,
          namespace: this.namespace.value
        };
        if (schema == null) {
          this.registryService.createOrUpdateMetadataSchema(Object.assign(new MetadataSchema(), values)).subscribe((newSchema) => {
            this.submitForm.emit(newSchema);
          });
        } else {
          this.registryService.createOrUpdateMetadataSchema(Object.assign(new MetadataSchema(), {
            id: schema.id,
            prefix: (values.prefix ? values.prefix : schema.prefix),
            namespace: (values.namespace ? values.namespace : schema.namespace)
          })).subscribe((updatedSchema) => {
            this.submitForm.emit(updatedSchema);
          });
        }
      }
    );
  }
}
