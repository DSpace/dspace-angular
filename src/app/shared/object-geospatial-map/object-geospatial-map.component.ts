import {
  isPlatformBrowser,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';

import { environment } from '../../../environments/environment';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { ViewMode } from '../../core/shared/view-mode.model';
import { fadeIn } from '../animations/fade';
import { hasValue } from '../empty.util';
import { GeospatialMapComponent } from '../geospatial-map/geospatial-map.component';
import { GeospatialMapDetail } from '../geospatial-map/models/geospatial-map-detail.model';
import { ItemSearchResult } from '../object-collection/shared/item-search-result.model';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { parseGeoJsonFromMetadataValue } from '../utils/geospatial.functions';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-geospatial-map',
  styleUrls: ['./object-geospatial-map.component.scss'],
  templateUrl: './object-geospatial-map.component.html',
  animations: [fadeIn],
  standalone: true,
  imports: [
    GeospatialMapComponent,
    NgIf,
  ],
})

/**
 * This component is used with the GeospatialMap ViewMode in search or browse results, and
 * prepares geospatial data collection for display on the GeospatialMapComponent
 */
export class ObjectGeospatialMapComponent {

  /**
   * The view mode of this component
   */
  viewMode = ViewMode.GeospatialMap;

  /**
   * Search result objects
   */
  @Input() objects: RemoteData<PaginatedList<ListableObject>>;

  protected readonly isPlatformBrowser = isPlatformBrowser;

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  /**
   * Get current objects and extract geospatial metadata to use in the view
   */
  get mapInfo(): GeospatialMapDetail[] {
    const geospatialFields = environment.geospatialMapViewer.spatialMetadataFields;
    const mapInfo: GeospatialMapDetail[] = [];
    this.objects.payload.page.forEach(obj => {
      for (let i = 0; i < geospatialFields.length; i++) {
        const m = (obj as ItemSearchResult).indexableObject.metadata[geospatialFields[i]];
        if (m && m.length > 0) {
          for (let j = 0; j < m.length; j++) {
            const dso = (obj as ItemSearchResult).indexableObject as Item;
            const value = m[j].value;
            if (hasValue(value) && hasValue(dso)) {
              const mapDetail = this.parseMapDetail(value, dso);
              if (hasValue(mapDetail)) {
                mapInfo.push(mapDetail);
              }
            }
          }
        }
      }
    });
    return mapInfo;
  }

  /**
   * Parse map detail needed to draw clickable markers on a map, from WKT strings
   *
   * @param value
   * @param dso
   * @private
   */
  private parseMapDetail(value: string, dso: Item) {
    try {
      const geospatialMapDetail = new GeospatialMapDetail();
      geospatialMapDetail.route = getItemPageRoute(dso);
      geospatialMapDetail.title = dso.name;
      value = value.replace(/\+/g, '');
      const point = parseGeoJsonFromMetadataValue(value);
      // Do some simple validation and log a console error if not valid
      if (!hasValue(point) || point.type !== 'Point'
        || !hasValue(point.coordinates)
        || point.coordinates.length < 2) {
        console.warn('Could not parse point from WKT string: ' + value);
      } else {
        // GeoJSON coordinates are [x, y] or [longitude, latitude] or [eastings, northings]
        geospatialMapDetail.points.push({
          longitude: point.coordinates[0],
          latitude: point.coordinates[1],
          url: geospatialMapDetail.route,
          title: geospatialMapDetail.title,
        });
        return geospatialMapDetail;
      }
    } catch (e) {
      console.warn(`Could not parse point from WKT string: ${value}, error: ${(e as Error).message}`);
    }
    return null;
  }

}
