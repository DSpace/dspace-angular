import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { OpenstreetmapComponent } from './openstreetmap.component';

describe('OpenstreetmapComponent', () => {
  let component: OpenstreetmapComponent;
  let fixture: ComponentFixture<OpenstreetmapComponent>;
  const testItem = Object.assign(new Item(), {
    uuid: 'itemUUID',
    id: 'itemUUID',
    metadata: {
      'dcterms.spatial': [
        {
          value: 'POINT(12.4924 41.8902)',
        },
        {
          value: 'POINT(2.3522 48.8566)',
        },
      ],
      'dc.coverage.spatial': [
        {
          value: 'POINT(-0.1278 51.5074)',
        },
        {
          value: '{westlimit=12.23, southlimit=41.65, eastlimit=12.85, northlimit=42.02}',
        },
      ],
    },
    _links: {
      self: { href: 'item-selflink' },
    },
  });

  const mockField = Object.assign({
    id: 1,
    metadata: 'dcterms.spatial',
    fieldType: 'METADATAGROUP',
    label: 'Location(s)',
    rendering: 'OPENSTREETMAP',
    style: 'container row',
    styleLabel: 'fw-bold col-4',
    styleValue: 'col',
    metadataGroup: {
      leading: 'dcterms.spatial',
      elements: [
        {
          metadata: 'dcterms.spatial',
          label: 'Spatial',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'fw-bold col-0',
          styleValue: 'col',
        },
        {
          metadata: 'dc.coverage.spatial',
          label: 'Coverage',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'fw-bold col-0',
          styleValue: 'col',
        },
      ],
    },
  }) as LayoutField;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        OpenstreetmapComponent,
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(OpenstreetmapComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenstreetmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract coordinates from multiple metadata fields', () => {
    expect(component.points.length).toBe(3);
    expect(component.points).toContain('POINT(12.4924 41.8902)');
    expect(component.points).toContain('POINT(2.3522 48.8566)');
    expect(component.points).toContain('POINT(-0.1278 51.5074)');
  });

  it('should extract bboxes from multiple metadata fields', () => {
    expect(component.bboxes.length).toBe(1);
    expect(component.bboxes).toContain('{westlimit=12.23, southlimit=41.65, eastlimit=12.85, northlimit=42.02}');
  });

  it('should have clustering enabled by default', () => {
    expect(component.cluster).toBeTrue();
  });
});
