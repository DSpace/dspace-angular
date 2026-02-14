import { Config } from './config';

export class GeospatialMapConfig extends Config {
  /**
   * The metadata fields which hold WKT points, to use when drawing a map
   */
  @Config.publish() spatialMetadataFields: string[];

  /**
   * Discovery search configuration which will return facets of geospatial points
   */
  @Config.publish() spatialFacetDiscoveryConfiguration: string;

  /**
   * Discovery filter for geospatial point
   */
  @Config.publish() spatialPointFilterName: string;

  /**
   * A simple switch to test for inclusion of geospatial item page fields in templates
   */
  @Config.publish() enableItemPageFields: boolean;

  /**
   * Include the map view mode in the list of view modes provided in a search results page
   */
  @Config.publish() enableSearchViewMode: boolean;

  /**
   * Include a Browse By Geographic Location map in the browse menu links
   */
  @Config.publish() enableBrowseMap: boolean;

  /**
   * The url string tempalte for a tile provider, e.g. https://tile.openstreetmap.org/{z}/{x}/{y}.png
   * to pass to TileLayer when initialising a leaflet map
   */
  @Config.publish() tileProviders: string[];

  /**
   * Starting centre point for maps (before drawing and zooming to markers)
   * Takes a lat and lng float value as coordinates
   * Defaults to Istanbul
   */
  @Config.publish() defaultCentrePoint: { lat: number, lng: number };

}
