import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MetadataSchemaDataService } from '../../../../core/data/metadata-schema-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { RegistryService } from '../../../../core/registry/registry.service';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { FieldUpdate } from '../../../../core/data/object-updates/object-updates.reducer';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { NgModel } from '@angular/forms';
import { MetadatumViewModel } from '../../../../core/shared/metadata.models';
import { MetadataField } from '../../../../core/metadata/metadata-field.model';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ds-edit-in-place-field]',
  styleUrls: ['./edit-in-place-field.component.scss'],
  templateUrl: './edit-in-place-field.component.html',
})
/**
 * Component that displays a single metadatum of an item on the edit page
 */
export class EditInPlaceFieldComponent implements OnInit, OnChanges {
  /**
   * The current field, value and state of the metadatum
   */
  @Input() fieldUpdate: FieldUpdate;

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * List of strings with all metadata field keys available
   */
  @Input() metadataFields: string[];

  /**
   * The metadatum of this field
   */
  metadata: MetadatumViewModel;

  /**
   * Emits whether or not this field is currently editable
   */
  editable: Observable<boolean>;

  /**
   * Emits whether or not this field is currently valid
   */
  valid: Observable<boolean>;

  /**
   * The current suggestions for the metadatafield when editing
   */
  metadataFieldSuggestions: BehaviorSubject<InputSuggestion[]> = new BehaviorSubject([]);

  constructor(
    private registryService: RegistryService,
    private objectUpdatesService: ObjectUpdatesService,
    private metadataSchemaService: MetadataSchemaDataService
  ) {
  }

  /**
   * Sets up an observable that keeps track of the current editable and valid state of this field
   */
  ngOnInit(): void {
    this.editable = this.objectUpdatesService.isEditable(this.url, this.metadata.uuid);
    this.valid = this.objectUpdatesService.isValid(this.url, this.metadata.uuid);
  }

  /**
   * Sends a new change update for this field to the object updates service
   */
  update(ngModel?: NgModel) {
    this.objectUpdatesService.saveChangeFieldUpdate(this.url, cloneDeep(this.metadata));
    if (hasValue(ngModel)) {
      this.checkValidity(ngModel);
    }
  }

  /**
   * Method to check the validity of a form control
   * @param ngModel
   */
  public checkValidity(ngModel: NgModel) {
    ngModel.control.setValue(ngModel.viewModel);
    ngModel.control.updateValueAndValidity();
    this.objectUpdatesService.setValidFieldUpdate(this.url, this.metadata.uuid, ngModel.control.valid);
  }

  /**
   * Sends a new editable state for this field to the service to change it
   * @param editable The new editable state for this field
   */
  setEditable(editable: boolean) {
    this.objectUpdatesService.setEditableFieldUpdate(this.url, this.metadata.uuid, editable);
  }

  /**
   * Sends a new remove update for this field to the object updates service
   */
  remove() {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.url, cloneDeep(this.metadata));
  }

  /**
   * Notifies the object updates service that the updates for the current field can be removed
   */
  removeChangesFromField() {
    this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.metadata.uuid);
  }

  /**
   * Sets the current metadatafield based on the fieldUpdate input field
   */
  ngOnChanges(): void {
    this.metadata = cloneDeep(this.fieldUpdate.field) as MetadatumViewModel;
  }

  /**
   * Requests all metadata fields that contain the query string in their key
   * Then sets all found metadata fields as metadataFieldSuggestions
   * Ignores fields from metadata schemas "relation" and "relationship"
   * @param query The query to look for
   */
  findMetadataFieldSuggestions(query: string): void {
    if (isNotEmpty(query)) {
      this.registryService.queryMetadataFields(query, null, followLink('schema')).pipe(
        getSucceededRemoteData(),
        take(1),
        map((data) => data.payload.page),
        switchMap((fields: MetadataField[]) => {
            return fields.map((field: MetadataField, index: number) => {
              // Resolve the metadata field's schema if not already the case, to be able to form complete MD field name
              if (!hasValue(field.schemaResolved)) {
                field.schema.pipe(
                  getSucceededRemoteData(),
                  getRemoteDataPayload(),
                  map((schema: MetadataSchema) => {
                    field.schemaResolved = schema;
                    if (index == fields.length - 1) {
                      this.setInputSuggestions(fields);
                    }
                  }),
                  take(1)
                ).subscribe()
              } else {
                this.setInputSuggestions(fields);
              }
            });
          }
        ),
        take(1)).subscribe();
    } else {
      this.metadataFieldSuggestions.next([]);
    }
  }

  /**
   * Set the list of input suggestion with the given Metadata fields, which all require a resolved MetadataSchema
   * @param fields  list of Metadata fields, which all require a resolved MetadataSchema
   */
  setInputSuggestions(fields: MetadataField[]) {
    this.metadataFieldSuggestions.next(
      fields.map((field: MetadataField) => {
        const fieldNameWhole = field.schemaResolved.prefix + '.' + field.toString();
        return {
          displayValue: fieldNameWhole.split('.').join('.&#8203;'),
          value: fieldNameWhole
        };
      })
    );
  }

  /**
   * Check if a user should be allowed to edit this field
   * @return an observable that emits true when the user should be able to edit this field and false when they should not
   */
  canSetEditable(): Observable<boolean> {
    return this.editable.pipe(
      map((editable: boolean) => {
        if (editable) {
          return false;
        } else {
          return this.fieldUpdate.changeType !== FieldChangeType.REMOVE;
        }
      })
    );
  }

  /**
   * Check if a user should be allowed to disabled editing this field
   * @return an observable that emits true when the user should be able to disable editing this field and false when they should not
   */
  canSetUneditable(): Observable<boolean> {
    return this.editable;
  }

  /**
   * Check if a user should be allowed to remove this field
   * @return an observable that emits true when the user should be able to remove this field and false when they should not
   */
  canRemove(): Observable<boolean> {
    return observableOf(this.fieldUpdate.changeType !== FieldChangeType.REMOVE && this.fieldUpdate.changeType !== FieldChangeType.ADD);
  }

  /**
   * Check if a user should be allowed to undo changes to this field
   * @return an observable that emits true when the user should be able to undo changes to this field and false when they should not
   */
  canUndo(): Observable<boolean> {
    return this.editable.pipe(
      map((editable: boolean) => this.fieldUpdate.changeType >= 0 || editable)
    );
  }

  protected isNotEmpty(value): boolean {
    return isNotEmpty(value);
  }
}
