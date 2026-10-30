import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { geojsonToWKT } from '@terraformer/wkt';

import { environment } from '../../../environments/environment';
import { BtnDisabledDirective } from '../btn-disabled.directive';
import { parseGeoJsonFromMetadataValue } from '../utils/geospatial.functions';

@Component({
  selector: 'ds-geospatial-map-picker',
  styleUrls: ['./geospatial-map-picker.component.scss'],
  templateUrl: './geospatial-map-picker.component.html',
  imports: [
    BtnDisabledDirective,
    FormsModule,
    TranslateModule,
  ],
})
/**
 * Modal content allowing a single geospatial point to be picked, or an existing one verified, on a Leaflet map.
 * Opened directly via `NgbModal.open(GeospatialMapPickerComponent, ...)`. Value and result are WKT
 * `POINT(longitude latitude)` strings, matching `dcterms.spatial` and the geospatial map viewer.
 */
export class GeospatialMapPickerComponent implements AfterViewInit, OnDestroy {

  /**
   * Initial WKT point value, if any.
   */
  @Input() value: string;

  /**
   * Field label to show in the modal title.
   */
  @Input() label: string;

  lat: number = null;
  lng: number = null;

  private map: any;
  private marker: any;
  private leaflet: any;

  constructor(
    public activeModal: NgbActiveModal,
    private elRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
  }

  /**
   * Whether a point has been selected.
   */
  get hasPoint(): boolean {
    return hasValue(this.lat) && hasValue(this.lng);
  }

  /**
   * Whether the entered lat/lng falls outside the valid WGS84 range.
   */
  get isOutOfRange(): boolean {
    return (hasValue(this.lat) && (this.lat < -90 || this.lat > 90))
      || (hasValue(this.lng) && (this.lng < -180 || this.lng > 180));
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    if (hasValue(this.map)) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet'); require('leaflet-providers');
    this.leaflet = L;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon-2x.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });

    const initialPoint = this.parseInitialValue();
    const centre = initialPoint
      ? [initialPoint.coordinates[1], initialPoint.coordinates[0]]
      : [environment.geospatialMapViewer.defaultCentrePoint.lat, environment.geospatialMapViewer.defaultCentrePoint.lng];

    const el = this.elRef.nativeElement.querySelector('div.geospatial-map-picker-canvas');
    this.map = L.map(el, {
      center: centre,
      zoom: initialPoint ? 14 : 6,
      maxBoundsViscosity: 1.0,
      maxBounds: [
        [-85, -Infinity],
        [85, Infinity],
      ],
    });

    const tileProviders = environment.geospatialMapViewer.tileProviders;
    for (const provider of tileProviders) {
      L.tileLayer.provider(provider, { maxZoom: 18, minZoom: 1 }).addTo(this.map);
    }

    if (initialPoint) {
      this.setPoint(initialPoint.coordinates[1], initialPoint.coordinates[0], false);
    }

    this.map.on('click', (event: any) => {
      this.setPoint(event.latlng.lat, event.latlng.lng, true);
    });

    // Modal sizing finishes after the map is created, so the map needs a resize once that settles.
    setTimeout(() => this.map.invalidateSize(true), 150);
  }

  /**
   * Parses `value` as a WKT point, returning `null` if it's empty or not a valid point.
   */
  private parseInitialValue(): any {
    if (isEmpty(this.value)) {
      return null;
    }
    const point = parseGeoJsonFromMetadataValue(this.value);
    if (!hasValue(point) || point.type !== 'Point' || !hasValue(point.coordinates) || point.coordinates.length < 2) {
      return null;
    }
    return point;
  }

  /**
   * Moves the marker to the given coordinates (creating it if needed) and updates the lat/lng fields.
   *
   * @param recentre pan the map to the point; left false for manual input changes so the map doesn't jump
   *                 around while the user is still typing
   */
  setPoint(lat: number, lng: number, recentre: boolean): void {
    this.lat = lat;
    this.lng = lng;
    if (!hasValue(this.map)) {
      return;
    }
    if (hasValue(this.marker)) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = this.leaflet.marker([lat, lng], { draggable: true });
      this.marker.addTo(this.map);
      this.marker.on('dragend', () => {
        const latlng = this.marker.getLatLng();
        this.setPoint(latlng.lat, latlng.lng, false);
      });
    }
    if (recentre) {
      this.map.panTo([lat, lng]);
    }
  }

  onManualCoordinatesChange(): void {
    if (hasValue(this.lat) && hasValue(this.lng) && !this.isOutOfRange) {
      this.setPoint(this.lat, this.lng, true);
    }
  }

  /**
   * Closes the modal with the selected point as a WKT string.
   */
  confirm(): void {
    if (!this.hasPoint || this.isOutOfRange) {
      return;
    }
    const wkt = geojsonToWKT({ type: 'Point', coordinates: [this.lng, this.lat] });
    this.activeModal.close(wkt);
  }

  /**
   * Closes the modal with `null`, so the caller clears the field's value.
   */
  confirmClear(): void {
    this.activeModal.close(null);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
