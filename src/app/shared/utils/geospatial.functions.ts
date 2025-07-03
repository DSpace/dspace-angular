import { wktToGeoJSON } from '@terraformer/wkt';

/**
 * Parse a GeoJSON point from a metadata value containing a WKT string
 * @param value
 * @private
 */
export function parseGeoJsonFromMetadataValue(value): any {
  const point = undefined;
  value = value.replace(/\+/g, '');
  try {
    return wktToGeoJSON(value.toUpperCase());
  } catch (e) {
    console.warn(`Could not parse point from WKT string: ${value.points}, error: ${(e as Error).message}`);
  }
  return point;
}
