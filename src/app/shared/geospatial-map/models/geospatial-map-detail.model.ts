import { GeospatialMarkerDetail } from './geospatial-marker-detail.model';

export class GeospatialMapDetail {
  points: GeospatialMarkerDetail[] = [];
  route: string;
  title: string;
}
