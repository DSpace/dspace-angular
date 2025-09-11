import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
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
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../../shared/form/form.component';

@Component({
  selector: 'ds-metadata-schema-form',
  templateUrl: './metadata-schema-form.component.html',
  imports: [
    AsyncPipe,
    FormComponent,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * A form used for creating and editing metadata schemas
 */
export class MetadataSchemaFormComponent implements OnInit, OnDestroy {

  /**
   * A unique id used for ds-form
   */
  formId = 'metadata-schema-form';

  /**
   * The prefix for all messages related to this form
   */
  messagePrefix = 'admin.registries.metadata.form';

  /**
   * A dynamic input model for the name field
   */
  name: DynamicInputModel;

  /**
   * A dynamic input model for the namespace field
   */
  namespace: DynamicInputModel;

  /**
   * A list of all dynamic input models
   */
  formModel: DynamicFormControlModel[];

  /**
   * Layout used for structuring the form inputs
   */
  formLayout: DynamicFormLayout = {
    name: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
      },
    },
    namespace: {
      grid: {
        host: 'col col-sm-6 d-inline-block',
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

  /**
   * The {@link MetadataSchema} that is currently being edited
   */
  activeMetadataSchema$: Observable<MetadataSchema>;

  subscriptions: Subscription[] = [];

  constructor(
    protected registryService: RegistryService,
    protected formBuilderService: FormBuilderService,
    protected translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.name = new DynamicInputModel({
      id: 'name',
      label: this.translateService.instant(`${this.messagePrefix}.name`),
      name: 'name',
      validators: {
        required: null,
        pattern: '^[^. ,]*$',
        maxLength: 32,
      },
      required: true,
      errorMessages: {
        pattern: 'error.validation.metadata.name.invalid-pattern',
        maxLength: 'error.validation.metadata.name.max-length',
      },
    });
    this.namespace = new DynamicInputModel({
      id: 'namespace',
      label: this.translateService.instant(`${this.messagePrefix}.namespace`),
      name: 'namespace',
      validators: {
        required: null,
        maxLength: 256,
      },
      required: true,
      errorMessages: {
        maxLength: 'error.validation.metadata.namespace.max-length',
      },
    });
    this.formModel = [
      new DynamicFormGroupModel(
        {
          id: 'metadatadataschemagroup',
          group:[this.namespace, this.name],
        }),
    ];
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.activeMetadataSchema$ = this.registryService.getActiveMetadataSchema();
    this.subscriptions.push(this.activeMetadataSchema$.subscribe((schema: MetadataSchema) => {
      if (schema == null) {
        this.clearFields();
      } else {
        this.formGroup.patchValue({
          metadatadataschemagroup: {
            name: schema.prefix,
            namespace: schema.namespace,
          },
        });
        this.name.disabled = true;
      }
    }));
  }

  /**
   * Stop editing the currently selected metadata schema
   */
  onCancel() {
    this.registryService.cancelEditMetadataSchema();
  }

  /**
   * Submit the form
   * When the schema has an id attached -> Edit the schema
   * When the schema has no id attached -> Create new schema
   * Emit the updated/created schema using the EventEmitter submitForm
   */
  onSubmit(): void {
    this.activeMetadataSchema$.pipe(
      take(1),
      switchMap((schema: MetadataSchema) => {
        const metadataValues = {
          prefix: this.name.value,
          namespace: this.namespace.value,
        };
        if (schema == null) {
          return this.registryService.createOrUpdateMetadataSchema(Object.assign(new MetadataSchema(), metadataValues));
        } else {
          return this.registryService.createOrUpdateMetadataSchema(Object.assign(new MetadataSchema(), schema, {
            namespace: metadataValues.namespace,
          }));
        }
      }),
      switchMap((updatedOrCreatedSchema: MetadataSchema) => this.registryService.clearMetadataSchemaRequests().pipe(
        map(() => updatedOrCreatedSchema),
      )),
    ).subscribe((updatedOrCreatedSchema: MetadataSchema) => {
      this.submitForm.emit(updatedOrCreatedSchema);
      this.clearFields();
      this.registryService.cancelEditMetadataSchema();
    });
  }

  /**
   * Reset all input-fields to be empty
   */
  clearFields(): void {
    this.formGroup.reset('metadatadataschemagroup');
    this.name.disabled = false;
  }

  /**
   * Cancel the current edit when component is destroyed
   */
  ngOnDestroy(): void {
    this.onCancel();
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
