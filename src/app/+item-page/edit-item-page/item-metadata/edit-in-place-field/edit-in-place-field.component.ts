import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MetadataField } from '../../../../core/metadata/metadatafield.model';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { FieldUpdate } from '../../../../core/data/object-updates/object-updates.reducer';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { inListValidator } from '../../../../shared/utils/validator.functions';
import { getSucceededRemoteData } from '../../../../core/shared/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ds-edit-in-place-field',
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
   * The current route of this page
   */
  @Input() route: string;
  /**
   * The metadatum of this field
   */
  metadata: Metadatum;
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

  /**
   * List of strings with all metadata field keys available
   */
  metadataFields: Observable<string[]>;

  constructor(
    private metadataFieldService: RegistryService,
    private objectUpdatesService: ObjectUpdatesService,
  ) {
  }

  /**
   * Sets up an observable that keeps track of the current editable and valid state of this field
   */
  ngOnInit(): void {
    this.editable = this.objectUpdatesService.isEditable(this.route, this.metadata.uuid);
    this.valid = this.objectUpdatesService.isValid(this.route, this.metadata.uuid);
    this.metadataFields = this.findMetadataFields()
  }

  /**
   * Sends a new change update for this field to the object updates service
   */
  update(control?: FormControl) {
    this.objectUpdatesService.saveChangeFieldUpdate(this.route, this.metadata);
    if (hasValue(control)) {
      this.objectUpdatesService.setValidFieldUpdate(this.route, this.metadata.uuid, control.valid);
    }
  }

  /**
   * Sends a new editable state for this field to the service to change it
   * @param editable The new editable state for this field
   */
  setEditable(editable: boolean) {
    this.objectUpdatesService.setEditableFieldUpdate(this.route, this.metadata.uuid, editable);
  }

  /**
   * Sends a new remove update for this field to the object updates service
   */
  remove() {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.route, this.metadata);
  }

  /**
   * Notifies the object updates service that the updates for the current field can be removed
   */
  removeChangesFromField() {
    this.objectUpdatesService.removeSingleFieldUpdate(this.route, this.metadata.uuid);
  }

  /**
   * Sets the current metadatafield based on the fieldUpdate input field
   */
  ngOnChanges(): void {
    this.metadata = cloneDeep(this.fieldUpdate.field) as Metadatum;
  }

  /**
   * Requests all metadata fields that contain the query string in their key
   * Then sets all found metadata fields as metadataFieldSuggestions
   * @param query The query to look for
   */
  findMetadataFieldSuggestions(query: string): void {
    this.metadataFieldService.queryMetadataFields(query).pipe(
      // getSucceededRemoteData(),
      take(1),
      map((data) => data.payload.page)
    ).subscribe(
      (fields: MetadataField[]) => this.metadataFieldSuggestions.next(
        fields.map((field: MetadataField) => {
          return {
            displayValue: field.toString(),
            value: field.toString()
          }
        })
      )
    );
  }

  /**
   * Method to request all metadata fields and convert them to a list of strings
   */
  findMetadataFields(): Observable<string[]> {
    return this.metadataFieldService.getAllMetadataFields().pipe(
      getSucceededRemoteData(),
      take(1),
      map((remoteData$) => remoteData$.payload.page.map((field: MetadataField) => field.toString())));
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
    return this.editable.pipe(
      map((editable: boolean) => {
        if (editable) {
          return false;
        } else {
          return this.fieldUpdate.changeType !== FieldChangeType.REMOVE && this.fieldUpdate.changeType !== FieldChangeType.ADD;
        }
      })
    );
  }

  /**
   * Check if a user should be allowed to undo changes to this field
   * @return an observable that emits true when the user should be able to undo changes to this field and false when they should not
   */
  canUndo(): Observable<boolean> {
    return observableOf(this.fieldUpdate.changeType >= 0);
  }

  protected isNotEmpty(value): boolean {
    return isNotEmpty(value);
  }
}
