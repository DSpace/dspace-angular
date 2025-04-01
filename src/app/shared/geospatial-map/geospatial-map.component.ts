import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { wktToGeoJSON } from '@terraformer/wkt';
import {
  Observable,
  Subscription,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
} from '../empty.util';
import { FacetValue } from '../search/models/facet-value.model';
import { FacetValues } from '../search/models/facet-values.model';
import { GeospatialMapDetail } from './models/geospatial-map-detail.model';

@Component({
  selector: 'ds-geospatial-map',
  templateUrl: './geospatial-map.component.html',
  styleUrls: ['./geospatial-map.component.scss'],
  standalone: true,
})
/**
 * Component to draw points and polygons on a tiled map using leaflet.js
 * This component can be used by item page fields, the browse-by geospatial component, and the geospatial search
 * view mode to render related places of an item (e.g. metadata on a page), or items *as* places (e.g. browse / search)
 */
export class GeospatialMapComponent implements AfterViewInit, OnInit, OnDestroy {

  /**
   * Leaflet map object
   * @private
   */
  private map;

  /**
   * Lat / lng coordinate data to render on the map as markers
   */
  @Input() coordinates?: string[];

  /**
   * Bounding boxes to render on the map as rectangles
   */
  @Input() bbox?: string[];

  /**
   * Whether to cluster markers in groups
   */
  @Input() cluster = false;

  /**
   * Parsed, flattened, filtered list of coordinates
   */
  parsedCoordinates: any[] = [];

  /**
   * Parsed, flattened, filtered list of bounding boxes
   */
  parsedBoundingBoxes: any[] = [];

  /**
   * Facet values and current scope used by browse-by components
   */
  @Input() facetValues?: Observable<FacetValues>;

  /**
   * Current search scope, if any (for marker click links)
   */
  @Input() currentScope?: string;

  /**
   * Map info constructed from search results, and points
   */
  @Input() mapInfo?: GeospatialMapDetail[];

  /**
   * Layout info - "item", "browse", or "search"
   * @private
   */
  @Input() layout = 'item';

  DEFAULT_CENTRE_POINT = [environment.geospatialMapViewer.defaultCentrePoint.lat, environment.geospatialMapViewer.defaultCentrePoint.lng];

  private subs: Subscription[] = [];

  constructor(private elRef: ElementRef,
              @Inject(PLATFORM_ID) private platformId: string,
              private router: Router,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    // Filter out missing or undefined / null values from inputs
    if (hasValue(this.coordinates)) {
      this.parsedCoordinates = this.coordinates.map(c => this.parseAndValidatePoint(c)).filter(Boolean);
    }
    if (hasValue(this.bbox)) {
      this.parsedBoundingBoxes = this.bbox.map(b => b).filter(Boolean);
    }
  }

  ngAfterViewInit(): void {
    // Only initialize the map in browser mode
    if (isPlatformBrowser(this.platformId)) {
      if (hasValue(this.map)) {
        this.map.remove();
      }
      this.initMap();
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**
   * Initialize map component, tile providers, and draw markers depending on context
   *
   * @private
   */
  private initMap(): void {
    // 'Import' leaflet packages in a browser-mode-only way to avoid issues with SSR
    const L = require('leaflet'); require('leaflet.markercluster'); require('leaflet-providers');
    // Set better default icons
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon-2x.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });
    // Define map object
    this.map = L.map;

    // Get map by query selector - this is important NOT to use an id like 'map' because we might draw
    // many maps within a single page
    const el = this.elRef.nativeElement.querySelector('div.geospatial-map');
    // Defaults are London - we update this after drawing markers to zoom and fit based on data
    this.map = L.map(el, {
      center: this.DEFAULT_CENTRE_POINT,
      zoom: 11,
    });
    const tileProviders = environment.geospatialMapViewer.tileProviders;
    for (let i = 0; i < tileProviders.length; i++) {
      // Add tiles to the map
      const tiles = L.tileLayer.provider(tileProviders[i], {
        maxZoom: 18,
        minZoom: 3,
      });
      tiles.addTo(this.map);
    }

    // Call add markers function as appropriate (metadata values, facet results, search results)
    if (hasValue(this.coordinates)) {
      this.drawSimpleValueMarkers(L);
    } else if (hasValue(this.facetValues)) {
      // Subscribe to facet values and call draw when they fire
      this.subs.push(this.facetValues.subscribe((f) => {
        this.drawFacetValueMarkers(L, f.page);
      }));
    } else if (hasValue(this.mapInfo)) {
      this.drawSearchResultMarkers(L);
    }

  }

  /**
   * Draw markers and bounding boxes given the parsed inputs
   *
   * @param L
   * @private
   */
  private drawSimpleValueMarkers(L) {
    let bounds = this.map.getBounds();
    // Construct GeoJSON points, iterate and add markers to the map or cluster
    const points = this.parsedCoordinates;
    const markers = L.markerClusterGroup();
    points.forEach(point => {
      const marker = L.marker([point.coordinates[1], point.coordinates[0]], {
        icon: new L.Icon.Default(),
      });
      if (this.cluster) {
        markers.addLayer(marker);
      } else {
        this.map.addLayer(marker);
      }
    });
    if (this.cluster) {
      this.map.addLayer(markers);
    }

    // Set bounds based on farthest points
    bounds = L.latLngBounds(points.map(p => [p.coordinates[1], p.coordinates[0]]));

    // Draw bounding boxes, if present
    let bboxBounds;
    if (isNotEmpty(this.parsedBoundingBoxes)) {
      this.parsedBoundingBoxes.forEach(b => {
        if (hasValue(b)) {
          bboxBounds = this.renderBoundingBox(L, b);
        }
      });
    }

    // Map bounds / zoom fitting tends to be smoother when done after a short delay
    setTimeout(() => {
      if (bboxBounds && this.coordinates.length === 1) {
        // One point, at least one bbox, use its bounds. Otherwise, use the calculation based on points.
        bounds = bboxBounds;
      }
      this.map.invalidateSize(true);
      this.map.fitBounds(bounds);
    }, 500);
  }

  /**
   * Draw markers (parsed from facet values) to map using leaflet L and facet values f, with tooltips
   * and click events
   *
   * @param L leaflet library
   * @param f array of facet values
   * @private
   */
  private drawFacetValueMarkers(L, f: FacetValue[]) {
    if (!hasValue(f)) {
      return null;
    }
    const filter = 'f.' + environment.geospatialMapViewer.spatialPointFilterName;
    const points = f.map((facetValue) => {
      const point = this.parseAndValidatePoint(facetValue.value);
      if (!hasValue(point)) {
        return false;
      }
      // Set point display values based on facet
      point.label = facetValue.label;
      point.value = facetValue.value;
      point.count = facetValue.count;
      point.url = '/search';
      return point;
    }).filter((point) => hasValue(point) && hasValue(point.coordinates) && point.coordinates.length === 2);
    // If there are no points to draw, instead zoom out and show a tooltip and return early
    if (isEmpty(points)) {
      this.map.setZoom(1);
      const marker = new L.marker(this.DEFAULT_CENTRE_POINT, { opacity: 0 });
      marker.bindTooltip('<span class="fs-4 no-results-tooltip">' + this.translateService.instant('search.results.geospatial-map.empty') + '</span>', { permanent: true, offset: [0, 0], direction: 'top' });
      this.map.addLayer(marker);
      return;
    }
    // We have >0 markers, so construct links and tooltips for each
    const markers = L.markerClusterGroup();
    for (let i = 0; i < points.length; i++) {
      // GeoJSON coordinates are [x, y] or [longitude, latitude] or [eastings, northings]
      const point = points[i];
      const longitude = point.coordinates[0];
      const latitude = point.coordinates[1];
      // Basic tooltip here just shows label and count
      const marker = L.marker([latitude, longitude], {
        icon: new L.Icon.Default(),
      }).bindTooltip(point.label + '<br/>(' + point.count + ' ' + this.translateService.instant('browse.metadata.map.count.items')
        + ')', {
        permanent: false,
        direction: 'top',
      }).on('click', () => {
        // On click, make a filtered search using the point filter ('f.point' by default)
        this.router.navigate([point.url],
          { queryParams: { 'spc.page': 1, [filter]: point.value + ',equals', 'scope': this.currentScope } });
      });
      markers.addLayer(marker);
    }

    // Map bounds / zoom fitting tends to be smoother when done after a short delay
    setTimeout(() => {
      this.map.addLayer(markers);
      const bounds = L.latLngBounds(points.map(point => [point.coordinates[1], point.coordinates[0]]));
      this.map.invalidateSize(true);
      this.map.fitBounds(bounds);
    }, 500);
  }

  /**
   * Draw search result markers from the passed mapInfo input, with tooltips and click events
   *
   * @param L
   */
  private drawSearchResultMarkers(L) {
    // Now iterate points and build cluster
    if (this.mapInfo && this.mapInfo.length > 0) {
      const points = this.mapInfo.reduce((acc, mapDetail) =>
        acc.concat(mapDetail.points), []);
      const markers = L.markerClusterGroup();
      points.forEach(point => {
        const marker = L.marker([point.latitude, point.longitude], {
          icon: new L.Icon.Default(),
        }).bindTooltip(point.title, {
          permanent: false,
          direction: 'top',
        }).on('click', () => {
          this.router.navigate([point.url]);
        });
        markers.addLayer(marker);
      });
      this.map.addLayer(markers);
      const bounds = L.latLngBounds(points.map(point => [point.latitude, point.longitude]));
      this.map.fitBounds(bounds);
    } else {
      // If there are no points to draw, instead zoom out and show a tooltip
      this.map.setZoom(1);
      const marker = new L.marker(this.DEFAULT_CENTRE_POINT, { opacity: 0 });
      marker.bindTooltip('<span class="fs-4 no-results-tooltip">' + this.translateService.instant('search.results.geospatial-map.empty') + '</span>', { permanent: true, offset: [0, 0], direction: 'top' });
      this.map.addLayer(marker);
    }
  }

  /**
   * Render a bounding box and return its bounds / rectangle elements
   *
   * @param L
   * @param bbox
   * @private
   */
  private renderBoundingBox(L, bbox: string): number[][] {
    if (hasValue(bbox)) {
      let parsedBbox = bbox.replace(/[{} ]/g, '');
      parsedBbox = parsedBbox.replace(/[^=,]+=/g, '');
      const parsedBboxParts = parsedBbox.split(',', 4);
      // Validate that we have exactly 4 parts
      if (parsedBboxParts.length !== 4) {
        console.error('Invalid bounding box format: expected 4 coordinates but got ' + parsedBboxParts.length);
        return;
      }
      // Convert to numbers and validate
      const coordinates = parsedBboxParts.map(part => parseFloat(part));
      if (coordinates.some(isNaN)) {
        console.error('Invalid bounding box: contains non-numeric values', parsedBboxParts);
        return;
      }
      // Create bounds array with proper structure [[lat1, lng1], [lat2, lng2]]
      const bounds = [[coordinates[1], coordinates[0]], [coordinates[2], coordinates[3]]];
      // Validate latitude values (-90 to 90)
      if (bounds[0][0] < -90 || bounds[0][0] > 90 || bounds[1][0] < -90 || bounds[1][0] > 90) {
        console.error('Invalid bounding box: latitude values must be between -90 and 90', bounds);
        return;
      }
      // Validate longitude values (-180 to 180)
      if (bounds[0][1] < -180 || bounds[0][1] > 180 || bounds[1][1] < -180 || bounds[1][1] > 180) {
        console.error('Invalid bounding box: longitude values must be between -180 and 180', bounds);
        return;
      }
      const boundingBox = L.rectangle(bounds, { color: '#5574BB', weight: 2, fill: false });
      this.map.addLayer(boundingBox);
      // return bounds so the map can be centred / zoomed appropriately
      return bounds;
    }
  }

  /**
   * Handle parsing and some simple error validation for WKT point to GeoJSON
   *
   * @param coordinates
   * @private
   */
  private parseAndValidatePoint(coordinates): any {
    // Parse WKT Point to GeoJSON
    const point = this.parseGeoJsonFromMetadataValue(coordinates);
    // Do some simple validation and log a console error if not valid
    if (!hasValue(point) || point.type !== 'Point'
      || !hasValue(point.coordinates)
      || point.coordinates.length < 2) {
      console.error('Could not parse point from WKT string: ' + coordinates);
      return;
    }
    return point;
  }

  /**
   * Parse a GeoJSON point from a metadata value containing a WKT string
   * @param value
   * @private
   */
  private parseGeoJsonFromMetadataValue(value): any {
    if (hasValue(value)) {
      const point = undefined;
      value = value.replace(/\+/g, '');
      try {
        return wktToGeoJSON(value.toUpperCase());
      } catch (e) {
        console.warn(`Could not parse point from WKT string: ${value.points}, error: ${(e as Error).message}`);
      }
      return point;
    }
  }

  get leafletMap() {
    return this.map;
  }

}
