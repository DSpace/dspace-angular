import { Config } from './config.interface';

export class GeospatialMapConfig implements Config {

  /**
   * The metadata fields which hold WKT points, to use when drawing a map
   */
  public spatialMetadataFields: string[];

  /**
   * Discovery search configuration which will return facets of geospatial points
   */
  public spatialFacetDiscoveryConfiguration: string;

  /**
   * Discovery filter for geospatial point
   */
  public spatialPointFilterName: string;

  /**
   * A simple switch to test for inclusion of geospatial item page fields in templates
   */
  public enableItemPageFields: boolean;

  /**
   * Include the map view mode in the list of view modes provided in a search results page
   */
  public enableSearchViewMode: boolean;

  /**
   * Include a Browse By Geographic Location map in the browse menu links
   */
  public enableBrowseMap: boolean;

  /**
   * The url string tempalte for a tile provider, e.g. https://tile.openstreetmap.org/{z}/{x}/{y}.png
   * to pass to TileLayer when initialising a leaflet map
   */
  public tileProviders: string[];

  /**
   * Starting centre point for maps (before drawing and zooming to markers)
   * Takes a lat and lng float value as coordinates
   * Defaults to Istanbul
   */
  public defaultCentrePoint: { lat: number, lng: number };

}
