import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateModule } from '@ngx-translate/core';

import { GeospatialMapComponent } from '../../../../../../../shared/geospatial-map/geospatial-map.component';
import { OsmapComponent } from './osmap.component';

describe('OsmapComponent', () => {
  let component: OsmapComponent;
  let fixture: ComponentFixture<OsmapComponent>;

  const coordinateValues = [
    Object.assign(new MetadataValue(), { value: 'POINT(12.4924 41.8902)', place: 0 }),
    Object.assign(new MetadataValue(), { value: 'POINT(2.3522 48.8566)', place: 1 }),
  ];

  const bboxValues = [
    Object.assign(new MetadataValue(), { value: '{westlimit=12.23, southlimit=41.75, eastlimit=12.85, northlimit=42.02}', place: 0 }),
  ];

  const testItem = Object.assign(new Item(), {
    type: 'item',
    metadata: {
      'dcterms.spatial': coordinateValues,
      'dcterms.spatial.bbox': bboxValues,
    },
    uuid: 'test-item-uuid',
  });

  const mockField = {
    metadata: 'dcterms.spatial',
    label: 'Geospatial',
    rendering: 'OPENSTREETMAP',
    fieldType: 'METADATAGROUP',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true,
    metadataGroup: {
      leading: 'dcterms.spatial',
      elements: [
        {
          metadata: 'dcterms.spatial',
          label: 'Coordinates',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: '',
          styleValue: '',
        },
        {
          metadata: 'dcterms.spatial.bbox',
          label: 'Bounding Box',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: '',
          styleValue: '',
        },
      ],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OsmapComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
    }).overrideComponent(OsmapComponent, {
      remove: {
        imports: [GeospatialMapComponent],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(OsmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract coordinates from the first metadata group element', () => {
    expect(component.coordinates).toEqual(['POINT(12.4924 41.8902)', 'POINT(2.3522 48.8566)']);
  });

  it('should extract bounding boxes from the second metadata group element', () => {
    expect(component.bboxes).toEqual(['{westlimit=12.23, southlimit=41.75, eastlimit=12.85, northlimit=42.02}']);
  });

  it('should report hasData as true when coordinates are present', () => {
    expect(component.hasData).toBeTrue();
  });

  it('should report hasData as false when no geospatial data is present', () => {
    component.coordinates = [];
    component.bboxes = [];
    expect(component.hasData).toBeFalse();
  });

  describe('when no bounding box element is configured', () => {
    beforeEach(async () => {
      const fieldWithoutBbox = {
        ...mockField,
        metadataGroup: {
          leading: 'dcterms.spatial',
          elements: [
            {
              metadata: 'dcterms.spatial',
              label: 'Coordinates',
              rendering: 'TEXT',
              fieldType: 'METADATA',
              style: null,
              styleLabel: '',
              styleValue: '',
            },
          ],
        },
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          OsmapComponent,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: 'fieldProvider', useValue: fieldWithoutBbox },
          { provide: 'itemProvider', useValue: testItem },
          { provide: 'renderingSubTypeProvider', useValue: '' },
          { provide: 'tabNameProvider', useValue: '' },
        ],
      }).overrideComponent(OsmapComponent, {
        remove: {
          imports: [GeospatialMapComponent],
        },
      }).compileComponents();

      fixture = TestBed.createComponent(OsmapComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have empty bboxes when only one element is configured', () => {
      expect(component.bboxes).toEqual([]);
    });

    it('should still extract coordinates', () => {
      expect(component.coordinates).toEqual(['POINT(12.4924 41.8902)', 'POINT(2.3522 48.8566)']);
    });
  });
});
