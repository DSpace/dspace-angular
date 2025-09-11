import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config';
import {
  BrowseDefinitionDataService,
  APP_DATA_SERVICES_MAP,
  ITEM,
  BrowseDefinitionDataServiceStub,
  TranslateLoaderMock,
} from '@dspace/core'
import { Store } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../../environments/environment';
import {
  MetadataValuesComponent,
} from '../../../../field-components/metadata-values/metadata-values.component';
import { mockItemWithMetadataFieldsAndValue } from '../item-page-field.component.spec';
import { GeospatialItemPageFieldComponent } from './geospatial-item-page-field.component';

let comp: GeospatialItemPageFieldComponent;
let fixture: ComponentFixture<GeospatialItemPageFieldComponent>;

const mockValue = 'Point ( +174.000000 -042.000000 )';
const mockField = 'dcterms.spatial';
const mockLabel = 'Test location';
const mockFields = [mockField];

const mockDataServiceMap: any = new Map([
  [ITEM.value, () => import('../../../../projects/dspace/core/src/lib/testing/test-data-service.mock').then(m => m.TestDataService)],
]);
describe('GeospatialItemPageFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GeospatialItemPageFieldComponent, MetadataValuesComponent, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      })],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: Store, useValue: MockStore },
        { provide: APP_DATA_SERVICES_MAP, useValue: mockDataServiceMap },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(GeospatialItemPageFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(GeospatialItemPageFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldsAndValue([mockField], mockValue);
    comp.pointFields = mockFields;
    comp.bboxFields = mockFields;
    comp.label = mockLabel;

    fixture.detectChanges();
  }));

  it('should initialize a map from passed points', () => {
    expect(comp.bboxes).toContain(mockValue);
    expect(comp.points).toContain(mockValue);
  });
});
