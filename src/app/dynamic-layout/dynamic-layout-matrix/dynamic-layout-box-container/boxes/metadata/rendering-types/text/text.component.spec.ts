import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': 'test item title',
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


  const mockField: LayoutField = {
    'metadata': 'dc.title',
    'label': 'Title',
    'rendering': null,
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
      }), BrowserAnimationsModule, TextComponent, DsDatePipe],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'metadataValueProvider', useValue: metadataValue },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
    expect(spanValueFound.length).toBe(1);
    expect(spanValueFound[0].nativeElement.textContent).toContain(metadataValue.value);
    done();
  });

  it('check value style', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
    expect(spanValueFound.length).toBe(1);
    done();
  });

});
