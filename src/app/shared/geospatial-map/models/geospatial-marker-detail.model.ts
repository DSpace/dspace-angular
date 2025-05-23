/**
 * This class is used by GeospatialMapDetail, to keep richer data for a list of points
 * so that they can be rendered as links and alt-text or hover text when drawn on a map
 */
export class GeospatialMarkerDetail {
  latitude: number;
  longitude: number;
  url: string;
  title: string;
}
