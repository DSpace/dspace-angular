import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { BrowseDefinitionDataServiceStub } from '../../../../../shared/testing/browse-definition-data-service.stub';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { MetadataValuesComponent } from '../../../../field-components/metadata-values/metadata-values.component';
import { mockItemWithMetadataFieldsAndValue } from '../item-page-field.component.spec';
import { GeospatialItemPageFieldComponent } from './geospatial-item-page-field.component';

let comp: GeospatialItemPageFieldComponent;
let fixture: ComponentFixture<GeospatialItemPageFieldComponent>;

const mockValue = 'Point ( +174.000000 -042.000000 )';
const mockField = 'dcterms.spatial';
const mockLabel = 'Test location';
const mockFields = [mockField];

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
    comp.fields = mockFields;
    comp.label = mockLabel;

    fixture.detectChanges();
  }));

  it('should initialize a map from passed points', () => {
    expect(fixture.nativeElement.querySelector('ds-geospatial-map[ng-reflect-coordinates="Point ( +174.000000 -042.00000"]')).toBeTruthy();
  });
});
