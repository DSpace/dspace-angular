import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../../../core/shared/item.model';
import {
  hasValue,
  isNotEmpty,
} from '../../../../../shared/empty.util';
import { GeospatialMapComponent } from '../../../../../shared/geospatial-map/geospatial-map.component';
import { MetadataFieldWrapperComponent } from '../../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-geospatial-item-page-field',
  templateUrl: './geospatial-item-page-field.component.html',
  imports: [
    GeospatialMapComponent,
    MetadataFieldWrapperComponent,
    NgIf,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * This component can be used to represent metadata on a simple item page.
 * It is the most generic way of displaying metadata values
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class GeospatialItemPageFieldComponent extends ItemPageFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  /**
   * List of fields to parse for WKT points
   */
  @Input() pointFields = ['dcterms.spatial'];

  /**
   * List of fields to parse for bounding box GeoJSON
   */
  @Input() bboxFields = ['dcterms.spatial'];

  /**
   * Whether to cluster markers into groups
   */
  @Input() cluster = false;

  bboxes: string[];
  points: string[];

  protected readonly hasValue = hasValue;
  protected readonly isNotEmpty = isNotEmpty;

  /**
   * On init, fetch point and bounding box metadata values for the given fields
   */
  ngOnInit() {
    if (hasValue(this.item)) {
      // Read all point values from all fields passed and flatten into a simple array of strings
      this.points = this.pointFields
        .map(f => this.item?.allMetadataValues(f))
        .reduce((acc, val) => acc.concat(val), [])
        .filter(Boolean);
      // Read all bounding box values from all fields passed and flatten into a simple array of strings
      this.bboxes = this.bboxFields
        .map(f => this.item?.allMetadataValues(f))
        .reduce((acc, val) => acc.concat(val), [])
        .filter(Boolean);
    }
  }


}
