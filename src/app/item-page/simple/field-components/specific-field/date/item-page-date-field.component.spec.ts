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

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { BrowseService } from '../../../../../core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { ActivatedRouteStub } from '../../../../../shared/testing/active-router.stub';
import { BrowseDefinitionDataServiceStub } from '../../../../../shared/testing/browse-definition-data-service.stub';
import { BrowseServiceStub } from '../../../../../shared/testing/browse-service.stub';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { MetadataValuesComponent } from '../../../../field-components/metadata-values/metadata-values.component';
import { mockItemWithMetadataFieldsAndValue } from '../item-page-field.component.spec';
import { ItemPageDateFieldComponent } from './item-page-date-field.component';

let comp: ItemPageDateFieldComponent;
let fixture: ComponentFixture<ItemPageDateFieldComponent>;

const mockField = 'dc.date.issued';
const mockValue = 'test value';

describe('ItemPageDateFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), ItemPageDateFieldComponent, MetadataValuesComponent],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: BrowseService, useValue: BrowseServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemPageDateFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageDateFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldsAndValue([mockField], mockValue);
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});
