import {
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { getMockTranslateService } from '../mocks/translate.service.mock';
import { GeospatialMapComponent } from './geospatial-map.component';

let elRef: ElementRef;

describe('GeospatialMapComponent', () => {
  let component: GeospatialMapComponent;
  let fixture: ComponentFixture<GeospatialMapComponent>;

  beforeEach( waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GeospatialMapComponent, TranslateModule.forRoot()],
      providers: [{ provide: TranslateService, useValue: getMockTranslateService() }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeospatialMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('component should call ngOnInit and ngAfterViewInit', () => {
    const spy = spyOn(component, 'ngOnInit').and.callThrough();
    const spy2 = spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngOnInit();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('component should create leaflet map on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.leafletMap).toBeTruthy();
  });

  describe('GeospatialMapComponent for metadata values', () => {
    // Mock data
    const bboxData = ['{east=169.975931486457, south=-46.125330124375715, north=-46.11633647562429, west=169.96295731354297, accuracyLevel=0}'];
    const pointData = ['Point ( +174.000000 -042.000000 )'];
    beforeEach(() => {
      fixture = TestBed.createComponent(GeospatialMapComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      // Assign mock data
      component.coordinates = pointData;
      component.bbox = bboxData;
      elRef = {
        nativeElement: jasmine.createSpyObj('nativeElement', {
          querySelector: {},
        }),
      };
    });

    it('metadata value map should parse coordinates on initialization', () => {
      component.ngOnInit();
      // Original input was ['Point ( +174.000000 -042.000000 )']; - this should be parsed properly
      const testGeoJSONPoint = Object({ type: 'Point', coordinates: [ 174, -42 ] });
      expect(component.parsedCoordinates).toEqual([testGeoJSONPoint]);
      component.ngAfterViewInit();

    });

    it('metadata value map should have the expected map container element', () => {
      const el = elRef.nativeElement.querySelector('div.geospatial-map');
      expect(el).toBeTruthy();
    });

    it('metadata value map should parse bounding boxes on initialization', () => {
      component.ngOnInit();
      expect(component.parsedBoundingBoxes).toEqual(bboxData);
    });

    it('metadata value map should have 4 layers rendered', () => {
      component.ngOnInit();
      component.ngAfterViewInit();
      let layers = [];
      let layerCount = 0;
      component.leafletMap.eachLayer(function(layer) {
        expect(layer).toBeTruthy();
        layerCount++;
        layers.push(layer);
      });
      // Tile layer, initial centre layer, single marker layer, bounding box layer
      expect(layerCount).toEqual(4);
    });

  });

  describe('GeospatialMapComponent for search results', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(GeospatialMapComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      // Assign mock data
      component.mapInfo = Object.assign([
        {
          route: 'test route',
          title: 'test title',
          points: [
            { latitude: 32, longitude: -2, url: 'test url 1', title: 'test title 1' },
            { latitude: -52, longitude: 12, url: 'test url 2', title: 'test title 2' },
          ],
        },
      ]);
      component.cluster = true;

      elRef = {
        nativeElement: jasmine.createSpyObj('nativeElement', {
          querySelector: {},
        }),
      };
    });

    it('search results map should have the expected map container element', () => {
      const el = elRef.nativeElement.querySelector('div.geospatial-map');
      expect(el).toBeTruthy();
    });

    it('search results map should have 6 layers rendered', () => {
      component.ngOnInit();
      component.ngAfterViewInit();
      let layers = [];
      let layerCount = 0;
      component.leafletMap.eachLayer(function(layer) {
        expect(layer).toBeTruthy();
        layerCount++;
        layers.push(layer);
      });
      // Tile layer, initial centre layer, marker group, feature group, marker 1, marker 2
      expect(layerCount).toEqual(6);
    });

  });

  describe('GeospatialMapComponent for browse facets', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(GeospatialMapComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      // Assign mock data
      const mockFacetValues = Object.assign({
        page: [
          {
            label: 'label 1',
            value: 'Point ( +174.000000 -042.000000 )',
            count: 10,
          },
          {
            label: 'label 2',
            value: 'Point ( +104.000000 -012.000000 )',
            count: 3,
          },
        ],
      });
      component.facetValues = of(mockFacetValues);
      component.cluster = true;

      elRef = {
        nativeElement: jasmine.createSpyObj('nativeElement', {
          querySelector: {},
        }),
      };

      // Init map
      component.ngOnInit();
      component.ngAfterViewInit();

    });

    it('browse facets map should have the expected map container element', () => {
      const el = elRef.nativeElement.querySelector('div.geospatial-map');
      expect(el).toBeTruthy();
    });

    it('browse facets map should have 6 layers rendered', () => {
      let layers = [];
      let layerCount = 0;
      component.leafletMap.eachLayer(function(layer) {
        expect(layer).toBeTruthy();
        layerCount++;
        layers.push(layer);
      });
      // Tile layer, initial centre layer, marker group, feature group, marker 1, marker 2
      // Facets are handled async so we have to wait for them to be fully drawn before testing layer count
      waitForAsync(() => {
        expect(layerCount).toEqual(6);
      });
    });

  });


});
