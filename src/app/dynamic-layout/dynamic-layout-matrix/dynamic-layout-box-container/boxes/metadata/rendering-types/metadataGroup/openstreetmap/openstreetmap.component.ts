import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

import { GeospatialMapComponent } from '../../../../../../../../shared/geospatial-map/geospatial-map.component';
import { FieldRenderingType } from '../../field-rendering-type';
import { MetadataBoxFieldRendering } from '../../metadata-box.decorator';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders geospatial metadata group fields on an OpenStreetMap map
 * using the ds-geospatial-map component.
 *
 * It supports multiple metadata fields within the metadata group for both point
 * coordinates and bounding boxes. All metadata values across all group elements
 * are collected and passed to the map component.
 */
@MetadataBoxFieldRendering(FieldRenderingType.OPENSTREETMAP, true)
@Component({
  selector: 'ds-openstreetmap',
  templateUrl: './openstreetmap.component.html',
  styleUrls: ['./openstreetmap.component.scss'],
  imports: [
    AsyncPipe,
    GeospatialMapComponent,
  ],
})
export class OpenstreetmapComponent extends MetadataGroupComponent implements OnInit {

  /**
   * Point coordinates extracted from the metadata group (WKT format, e.g. 'POINT(lng lat)')
   */
  points: string[] = [];

  /**
   * Bounding box values extracted from the metadata group
   */
  bboxes: string[] = [];

  /**
   * Whether to cluster markers on the map
   */
  cluster = true;

  override ngOnInit(): void {
    super.ngOnInit();
    this.extractGeospatialData();
  }

  /**
   * Extract point and bounding box values from all metadata fields in the group.
   * Point values are WKT POINT strings (e.g. 'POINT(lng lat)').
   * Bounding box values use a different format (e.g. '{westlimit=..., southlimit=..., ...}').
   * Simple heuristic: values starting with 'POINT' are treated as coordinates,
   * everything else is treated as a bounding box.
   */
  private extractGeospatialData(): void {
    this.points = [];
    this.bboxes = [];

    for (const element of this.field.metadataGroup.elements) {
      const values = this.item.allMetadataValues(element.metadata);
      if (values?.length) {
        for (const value of values) {
          if (!value) {
            continue;
          }
          if (value.trim().toUpperCase().startsWith('POINT')) {
            this.points.push(value);
          } else {
            this.bboxes.push(value);
          }
        }
      }
    }
  }
}
