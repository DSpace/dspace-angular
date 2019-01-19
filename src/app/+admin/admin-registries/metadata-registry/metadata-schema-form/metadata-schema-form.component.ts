import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicInputModel
} from "@ng-dynamic-forms/core";
import {MetadataSchema} from "../../../../core/metadata/metadataschema.model";
import {RegistryService} from "../../../../core/registry/registry.service";
import {FormService} from "../../../../shared/form/form.service";
import {FormBuilderService} from "../../../../shared/form/builder/form-builder.service";
import {FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../app.reducer";

@Component({
  selector: 'ds-metadata-schema-form',
  templateUrl: './metadata-schema-form.component.html',
  styleUrls: ['./metadata-schema-form.component.css']
})
export class MetadataSchemaFormComponent implements OnInit {

  formId: string = 'metadata-schema-form';

  private name: DynamicInputModel = new DynamicInputModel({
    id: 'name',
    label: 'name',
    name: 'name',
    validators: {
      required: null,
      pattern: "^[^ ,_]{1,32}$"
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
      id: "schema",
      legend: "schema",
      group: [
        this.namespace,
        this.name
      ]
    })
  ];

  formLayout: DynamicFormLayout = {
    "name": {
      grid: {
        control: 'col col-sm-5',
        label: 'col col-sm-5'
      }
    },
    "namespace": {
      grid: {
        control: 'col col-sm-5',
        label: 'col col-sm-5'
      }
    }
  };

  formGroup: FormGroup;

  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor(private registryService: RegistryService, private formBuilderService: FormBuilderService, private formService: FormService, private store: Store<AppState>) {
  }

  ngOnInit() {

    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.registryService.getActiveMetadataSchema().subscribe(schema => {
      this.formGroup.patchValue({
          schema: {
            name: schema != null ? schema.prefix : "",
            namespace: schema != null ? schema.namespace : ""
          }
        }
      );
    });
  }

  onCancel() {
    this.registryService.cancelEditMetadataSchema();
  }

  onSubmit() {
    this.registryService.getActiveMetadataSchema().subscribe(
      schema => {

        if (schema == null) {
          console.log("metadata field to create:");
          console.log("prefix: " + this.name.value);
          console.log("namespace: " + this.namespace.value);
        } else {
          console.log("metadata field to update:");
          console.log("prefix: " + this.name.value);
          console.log("namespace: " + this.namespace.value);
        }
      }
    );
  }
}
