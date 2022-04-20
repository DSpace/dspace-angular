import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  metadataFieldsToString,
  getFirstSucceededRemoteData
} from '../../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { RegistryService } from '../../../../core/registry/registry.service';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { NgModel } from '@angular/forms';
import { MetadatumViewModel } from '../../../../core/shared/metadata.models';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { FieldUpdate } from '../../../../core/data/object-updates/field-update.model';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
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
   * The metadatum of this field
   */
  @Input() metadata: MetadatumViewModel;

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
  findMetadataFieldSuggestions(query: string) {
    if (isNotEmpty(query)) {
      return this.registryService.queryMetadataFields(query, null, true, false, followLink('schema')).pipe(
        getFirstSucceededRemoteData(),
        metadataFieldsToString(),
      ).subscribe((fieldNames: string[]) => {
          this.setInputSuggestions(fieldNames);
        });
    } else {
      this.metadataFieldSuggestions.next([]);
    }
  }

  /**
   * Set the list of input suggestion with the given Metadata fields, which all require a resolved MetadataSchema
   * @param fields  list of Metadata fields, which all require a resolved MetadataSchema
   */
  setInputSuggestions(fields: string[]) {
    this.metadataFieldSuggestions.next(
      fields.map((fieldName: string) => {
        return {
          displayValue: fieldName.split('.').join('.&#8203;'),
          value: fieldName
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
