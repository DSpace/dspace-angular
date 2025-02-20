import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { environment } from '../../../../../../environments/environment';
import { BrowseService } from '../../../../../core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { APP_CONFIG } from '../../../../../core/config/app-config.interface';
import { ActivatedRouteStub } from '../../../../../core/utilities/testing/active-router.stub';
import { BrowseDefinitionDataServiceStub } from '../../../../../core/utilities/testing/browse-definition-data-service.stub';
import { BrowseServiceStub } from '../../../../../core/utilities/testing/browse-service.stub';
import { TranslateLoaderMock } from '../../../../../core/utilities/testing/translate-loader.mock';
import { MetadataValuesComponent } from '../../../../field-components/metadata-values/metadata-values.component';
import { mockItemWithMetadataFieldsAndValue } from '../item-page-field.component.spec';
import { GenericItemPageFieldComponent } from './generic-item-page-field.component';

let comp: GenericItemPageFieldComponent;
let fixture: ComponentFixture<GenericItemPageFieldComponent>;

const mockValue = 'test value';
const mockField = 'dc.test';
const mockLabel = 'test label';
const mockFields = [mockField];

describe('GenericItemPageFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), GenericItemPageFieldComponent, MetadataValuesComponent],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: BrowseService, useValue: BrowseServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(GenericItemPageFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(GenericItemPageFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldsAndValue([mockField], mockValue);
    comp.fields = mockFields;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});
