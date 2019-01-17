import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicInputModel
} from "@ng-dynamic-forms/core";
import {MetadataSchema} from "../../../../core/metadata/metadataschema.model";
import {FormBuilderService} from "../../../../shared/form/builder/form-builder.service";

@Component({
  selector: 'ds-metadata-schema-form',
  templateUrl: './metadata-schema-form.component.html',
  styleUrls: ['./metadata-schema-form.component.css']
})
export class MetadataSchemaFormComponent implements OnInit {

  private namespace: DynamicInputModel = new DynamicInputModel({
    id: 'namespace',
    label: 'namespace',
    name: 'namespace',
    required: true,
  });
  private name: DynamicInputModel = new DynamicInputModel({
    id: 'name',
    label: 'name',
    name: 'name',
    validators: {
      pattern: "^[^ ,_]{1,32}$"
    },
    required: true,
  });

  formModel: DynamicFormControlModel[] = [
    // new DynamicFormGroupModel({
    //   id: "schema",
    //   legend: "schema",
    //   group: [
        this.namespace,
        this.name
      // ]
    // })
  ];

  formLayout: DynamicFormLayout = {
    "namespace": {
      grid: {
        control: 'col col-sm-5',
        label: 'col col-sm-5'
      }
    },
    "name": {
      grid: {
        control: 'col col-sm-5',
        label: 'col col-sm-5'
      }
    }
  };

  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  private formGroup: any;

  constructor(private formService: FormBuilderService) {
  }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  onSubmit() {

    let metadataSchema: MetadataSchema = new MetadataSchema();
    metadataSchema.namespace = this.namespace.value + "";
    this.submitForm.emit(metadataSchema);
  }
}
