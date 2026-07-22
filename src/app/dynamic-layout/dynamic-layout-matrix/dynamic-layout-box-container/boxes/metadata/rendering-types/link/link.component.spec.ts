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
  TranslateService,
} from '@ngx-translate/core';

import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;
  let translateService;

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': 'http://rest.api/item/link/id',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.link': [metadataValue],
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

  const i18nLabel = 'Default Label';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, LinkComponent],
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
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  describe('without sub-type', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('check metadata rendering', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.link-value'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('a'));
      expect(valueFound.length).toBe(1);

      expect(valueFound[0].nativeElement.textContent).toContain(metadataValue.value);
      expect(valueFound[0].nativeElement.href).toBe(metadataValue.value);
      done();
    });

    it('check value style', (done) => {
      const valueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
      expect(valueFound.length).toBe(1);
      done();
    });
  });

  describe('with sub-type label', () => {
    beforeEach(() => {
      component.renderingSubType = 'LABEL';
      component.metadataValueProvider = Object.assign(new MetadataValue(), metadataValue, {
        value: '[Default Label](http://rest.api/item/link/id)',
      });
      component.metadataValue = component.metadataValueProvider;
      spyOn(translateService, 'instant').and.returnValue(i18nLabel);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('check metadata rendering', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.link-value'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('a'));
      expect(valueFound.length).toBe(1);

      expect(valueFound[0].nativeElement.textContent).toContain(i18nLabel);
      expect(valueFound[0].nativeElement.href).toBe(metadataValue.value);
      done();
    });

    it('check value style', (done) => {
      const valueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
      expect(valueFound.length).toBe(1);
      done();
    });
  });

  describe('with sub-type email', () => {
    beforeEach(() => {
      component.renderingSubType = 'EMAIL';
      spyOn(translateService, 'instant').and.returnValue(i18nLabel);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('check metadata rendering', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.link-value'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('a'));
      expect(valueFound.length).toBe(1);

      expect(valueFound[0].nativeElement.textContent).toContain(metadataValue.value);
      expect(valueFound[0].nativeElement.href).toBe('mailto:' + metadataValue.value);
      done();
    });

    it('check value style', (done) => {
      const valueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
      expect(valueFound.length).toBe(1);
      done();
    });
  });

  describe('URL validation and conditional rendering', () => {

    describe('valid URLs', () => {
      it('should render link for URL with http protocol', () => {
        component.metadataValue = { value: 'http://test.com' } as MetadataValue;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isLink).toBe(true);
        const linkElement = fixture.debugElement.query(By.css('span.link-value a'));
        expect(linkElement).toBeTruthy();
        expect(linkElement.nativeElement.href).toBe('http://test.com/');
      });

      it('should render link for URL with https protocol', () => {
        component.metadataValue = { value: 'https://test.com' } as MetadataValue;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isLink).toBe(true);
        const linkElement = fixture.debugElement.query(By.css('span.link-value a'));
        expect(linkElement).toBeTruthy();
      });

      it('should render link for URL with www prefix', () => {
        component.metadataValue = { value: 'www.test.com' } as MetadataValue;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isLink).toBe(true);
        const linkElement = fixture.debugElement.query(By.css('span.link-value a'));
        expect(linkElement).toBeTruthy();
        expect(linkElement.nativeElement.href).toBe('http://www.test.com/');
      });

      it('should render link for URL with path', () => {
        component.metadataValue = { value: 'https://test.com/path/to/page' } as MetadataValue;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isLink).toBe(true);
        const linkElement = fixture.debugElement.query(By.css('span.link-value a'));
        expect(linkElement).toBeTruthy();
      });

      it('should render link for FTP URL', () => {
        component.metadataValue = { value: 'ftp://files.test.com' } as MetadataValue;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isLink).toBe(true);
        const linkElement = fixture.debugElement.query(By.css('span.link-value a'));
        expect(linkElement).toBeTruthy();
        expect(linkElement.nativeElement.href).toBe('ftp://files.test.com/');
      });
    });

    describe('invalid URLs - plain text rendering', () => {
      it('should render plain text for random text without URL pattern', () => {
        component.metadataValue = { value: 'just some text' } as MetadataValue;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isLink).toBe(false);
        const plainText = fixture.debugElement.query(By.css('span.plain-text-value'));
        const link = fixture.debugElement.query(By.css('span.link-value a'));

        expect(plainText).toBeTruthy();
        expect(link).toBeFalsy();
        expect(plainText.nativeElement.textContent).toContain('just some text');
      });
    });
  });

  describe('parseLabelValue', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should correctly extract label and URL from [Label](URL) format', () => {
      const input = '[My Label](https://example.com/path)';
      const result = component.parseLabelValue(input);

      expect(result).toEqual({
        label: 'My Label',
        value: 'https://example.com/path',
      });
    });

    it('should return the same value if input does not match [Label](URL) format', () => {
      const input = 'Just a plain URL';
      const result = component.parseLabelValue(input);

      expect(result).toEqual({
        label: input,
        value: input,
      });
    });

    it('should handle empty string gracefully', () => {
      const input = '';
      const result = component.parseLabelValue(input);

      expect(result).toEqual({
        label: '',
        value: '',
      });
    });

  });
});
