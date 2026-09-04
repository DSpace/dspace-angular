import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';

import { GeospatialMapComponent } from '../../../../../../../shared/geospatial-map/geospatial-map.component';
import { FieldRenderingType } from '../field-rendering-type';
import { metadataBoxFieldRendering } from '../metadata-box.decorator';
import { MetadataGroupComponent } from '../metadataGroup/metadata-group.component';

/**
 * This component renders geospatial metadata fields using an OpenStreetMap view.
 *
 * It expects a metadata group configuration where the elements define:
 * - coordinate metadata fields
 * - bounding box metadata fields
 *
 * The first element in the metadata group is treated as coordinates,
 * the second (if present) as bounding boxes.
 */
@metadataBoxFieldRendering(FieldRenderingType.OSMAP)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-osmap]',
  templateUrl: './osmap.component.html',
  styleUrls: ['./osmap.component.scss'],
  imports: [
    GeospatialMapComponent,
  ],
})
export class OsmapComponent extends MetadataGroupComponent implements OnInit {

  /**
   * Coordinate values (WKT Point strings) extracted from the metadata group
   */
  coordinates: string[] = [];

  /**
   * Bounding box values extracted from the metadata group (optional second element)
   */
  bboxes: string[] = [];

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.extractGeospatialData();
  }

  /**
   * Extract coordinates and bounding boxes from the metadata group elements.
   * The first element is treated as coordinate metadata,
   * the second (if present) as bounding box metadata.
   */
  private extractGeospatialData(): void {
    const elements = this.field.metadataGroup?.elements || [];

    if (elements.length > 0) {
      this.coordinates = this.item.allMetadataValues(elements[0].metadata).filter(Boolean);
    }

    if (elements.length > 1) {
      this.bboxes = this.item.allMetadataValues(elements[1].metadata).filter(Boolean);
    }
  }

  /**
   * Whether there is any geospatial data to display
   */
  get hasData(): boolean {
    return isNotEmpty(this.coordinates) || isNotEmpty(this.bboxes);
  }
}
