import { GeospatialMarkerDetail } from './geospatial-marker-detail.model';

/**
 * This class is used by the ObjectGeospatialMap list view, to supply point data as well as
 * routing and title data for the DSO associated with the geospatial points.
 */
export class GeospatialMapDetail {
  points: GeospatialMarkerDetail[] = [];
  route: string;
  title: string;
}
