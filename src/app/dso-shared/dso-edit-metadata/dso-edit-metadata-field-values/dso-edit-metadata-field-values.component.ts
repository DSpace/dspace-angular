import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DsoEditMetadataChangeType, DsoEditMetadataForm } from '../dso-edit-metadata-form';
import { Observable } from 'rxjs/internal/Observable';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-dso-edit-metadata-field-values',
  styleUrls: ['./dso-edit-metadata-field-values.component.scss'],
  templateUrl: './dso-edit-metadata-field-values.component.html',
})
/**
 * Component displaying table rows for each value for a certain metadata field within a form
 */
export class DsoEditMetadataFieldValuesComponent {
  /**
   * The parent {@link DSpaceObject} to display a metadata form for
   * Also used to determine metadata-representations in case of virtual metadata
   */
  @Input() dso: DSpaceObject;
  /**
   * A dynamic form object containing all information about the metadata and the changes made to them, see {@link DsoEditMetadataForm}
   */
  @Input() form: DsoEditMetadataForm;

  /**
   * Metadata field to display values for
   */
  @Input() mdField: string;

  /**
   * Type of DSO we're displaying values for
   * Determines i18n messages
   */
  @Input() dsoType: string;

  /**
   * Observable to check if the form is being saved or not
   */
  @Input() saving$: Observable<boolean>;

  /**
   * Emit when the value has been saved within the form
   */
  @Output() valueSaved: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The DsoEditMetadataChangeType enumeration for access in the component's template
   * @type {DsoEditMetadataChangeType}
   */
  public DsoEditMetadataChangeTypeEnum = DsoEditMetadataChangeType;
}
