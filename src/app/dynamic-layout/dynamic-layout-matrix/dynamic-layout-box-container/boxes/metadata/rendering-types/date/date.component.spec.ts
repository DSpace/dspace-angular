import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';
import { FieldRenderingType } from '../field-rendering-type';
import { DateComponent } from './date.component';

describe('DateComponent', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;
  let localeService: LocaleService;

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': '2020-08-24',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.title': [metadataValue],
      },
      uuid: 'test-item-uuid',
    },
  );

  const localeServiceMock = Object.assign({
    getCurrentLanguageCode: () => of('en'),
  });

  const mockField: LayoutField = {
    'metadata': 'dc.date',
    'label': 'Date',
    'rendering': FieldRenderingType.DATE,
    'fieldType': 'METADATA',
    'style': null,
    'styleLabel': 'test-style-label',
    'styleValue': 'test-style-value',
    'labelAsHeading': false,
    'valuesInline': true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, DateComponent, DsDatePipe],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'metadataValueProvider', useValue: metadataValue },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: LocaleService, useValue: localeServiceMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    localeService = TestBed.inject(LocaleService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
    expect(spanValueFound.length).toBe(1);
    expect(spanValueFound[0].nativeElement.textContent).toContain('August 24, 2020');
    done();
  });

  it('check value style', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
    expect(spanValueFound.length).toBe(1);
    done();
  });

});
