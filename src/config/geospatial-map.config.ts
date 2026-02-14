import { Config } from './config';

export class GeospatialMapConfig extends Config {
  /**
   * The metadata fields which hold WKT points, to use when drawing a map
   */
  @Config.public spatialMetadataFields: string[] = ['dcterms.spatial'];

  /**
   * Discovery search configuration which will return facets of geospatial points
   */
  @Config.public spatialFacetDiscoveryConfiguration = 'geospatial';

  /**
   * Discovery filter for geospatial point
   */
  @Config.public spatialPointFilterName = 'point';

  /**
   * A simple switch to test for inclusion of geospatial item page fields in templates
   */
  @Config.public enableItemPageFields = false;

  /**
   * Include the map view mode in the list of view modes provided in a search results page
   */
  @Config.public enableSearchViewMode = false;

  /**
   * Include a Browse By Geographic Location map in the browse menu links
   */
  @Config.public enableBrowseMap = false;

  /**
   * The url string tempalte for a tile provider, e.g. https://tile.openstreetmap.org/{z}/{x}/{y}.png
   * to pass to TileLayer when initialising a leaflet map
   */
  @Config.public tileProviders: string[] = ['OpenStreetMap.Mapnik'];

  /**
   * Starting centre point for maps (before drawing and zooming to markers)
   * Takes a lat and lng float value as coordinates
   * Defaults to Istanbul
   */
  @Config.public defaultCentrePoint: { lat: number, lng: number } = {
    lat: 41.015137,
    lng: 28.979530,
  };
}
