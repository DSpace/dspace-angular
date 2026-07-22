import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { environment } from '../../../../../../../../environments/environment';
import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { ResolverStrategyService } from '../../../../../../services/resolver-strategy.service';
import { FieldRenderingType } from '../field-rendering-type';
import { IdentifierComponent } from './identifier.component';

describe('IdentifierComponent', () => {
  let component: IdentifierComponent;
  let fixture: ComponentFixture<IdentifierComponent>;
  let service: ResolverStrategyService;

  const doiMetadataValueWithoutSubType = Object.assign(new MetadataValue(), {
    'value': 'doi:10.1392/dironix',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });
  const doiMetadataValueWithSubType = Object.assign(new MetadataValue(), {
    'value': '10.1392/dironix',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });
  const hdlMetadataValue = Object.assign(new MetadataValue(), {
    'value': 'hdl:2434/690937',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });
  const emailMetadataValue = Object.assign(new MetadataValue(), {
    'value': 'mailto:danilo.dinuzzo@4science.it',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.identifier.doi': [doiMetadataValueWithoutSubType],
        'dc.identifier.hdl': [hdlMetadataValue],
        'person.email': [emailMetadataValue],
      },
      uuid: 'test-item-uuid',
    },
  );

  const mockField: LayoutField = {
    'metadata': 'dc.identifier',
    'label': 'Identifier',
    'rendering': FieldRenderingType.IDENTIFIER,
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
      }), BrowserAnimationsModule, IdentifierComponent],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'metadataValueProvider', useValue: doiMetadataValueWithoutSubType },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: ResolverStrategyService, useClass: ResolverStrategyService },
        { provide: APP_CONFIG, useValue: environment },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ResolverStrategyService);
  });

  describe('doi identifier rendering', () => {
    describe('without sub-type', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('check metadata rendering', (done) => {
        const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
        expect(spanValueFound.length).toBe(1);

        const valueFound = fixture.debugElement.queryAll(By.css('a'));
        expect(valueFound.length).toBe(1);

        const expectedContent = doiMetadataValueWithoutSubType.value.replace('doi:', '');
        const expectedHref = service.getBaseUrl('doi') + expectedContent;
        expect(valueFound[0].nativeElement.textContent).toBe(expectedContent);
        expect(valueFound[0].nativeElement.href).toBe(expectedHref);
        done();
      });

      it('check value style', (done) => {
        const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
        expect(spanValueFound.length).toBe(1);
        done();
      });
    });

    describe('with sub-type', () => {
      beforeEach(() => {
        component.metadataValue = doiMetadataValueWithSubType;
        component.renderingSubType = 'doi';
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('check metadata rendering', (done) => {
        const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
        expect(spanValueFound.length).toBe(1);

        const valueFound = fixture.debugElement.queryAll(By.css('a'));
        expect(valueFound.length).toBe(1);

        const expectedContent = doiMetadataValueWithSubType.value.replace('doi:', '');
        const expectedHref = service.getBaseUrl('doi') + expectedContent;
        expect(valueFound[0].nativeElement.textContent).toBe(expectedContent);
        expect(valueFound[0].nativeElement.href).toBe(expectedHref);
        done();
      });

      it('check value style', (done) => {
        const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
        expect(spanValueFound.length).toBe(1);
        done();
      });
    });
  });

  describe('hdl identifier rendering', () => {
    beforeEach(() => {
      component.metadataValue = hdlMetadataValue;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('check metadata rendering', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('a'));
      expect(valueFound.length).toBe(1);

      const expectedContent = hdlMetadataValue.value.replace('hdl:', '');
      const expectedHref = service.getBaseUrl('hdl') + expectedContent;
      expect(valueFound[0].nativeElement.textContent).toBe(expectedContent);
      expect(valueFound[0].nativeElement.href).toBe(expectedHref);
      done();
    });

    it('check value style', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
      expect(spanValueFound.length).toBe(1);
      done();
    });
  });

  describe('email identifier rendering', () => {
    beforeEach(() => {
      component.metadataValue = emailMetadataValue;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('check metadata rendering', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('a'));
      expect(valueFound.length).toBe(1);

      const expectedContent = emailMetadataValue.value.replace('mailto:', '');
      const expectedHref = service.getBaseUrl('mailto') + expectedContent;
      expect(valueFound[0].nativeElement.textContent).toBe(expectedContent);
      expect(valueFound[0].nativeElement.href).toBe(expectedHref);
      done();
    });

    it('check value style', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
      expect(spanValueFound.length).toBe(1);
      done();
    });
  });

  it('should keep white space in metadata value if shouldKeepWhiteSpaces is true', () => {
    expect(component.composeLink('keep my white spaces', 'keepMyWhiteSpaces')).toEqual({
      href: 'https://keepmywhitespaces.com/keep my white spaces',
      text: 'keep my white spaces',
    });
  });

  it('should not keep white space in metadata value if shouldKeepWhiteSpaces is false', () => {
    expect(component.composeLink('do not keep my white spaces', 'doi')).toEqual({
      href: 'https://doi.org/donotkeepmywhitespaces',
      text: 'do not keep my white spaces',
    });
  });

  describe('validateLink method', () => {
    describe('with http/https URLs', () => {
      it('should validate http URL', () => {
        const link = 'http://example.com';
        // Access private method through component instance (for testing purposes)
        expect((component as any).validateLink(link)).toBe(true);
      });

      it('should validate https URL', () => {
        const link = 'https://example.com';
        expect((component as any).validateLink(link)).toBe(true);
      });

      it('should validate https URL with path', () => {
        const link = 'https://example.com/path/to/resource';
        expect((component as any).validateLink(link)).toBe(true);
      });

      it('should reject invalid URL with spaces', () => {
        const link = 'https://example.com/path with spaces';
        expect((component as any).validateLink(link)).toBe(false);
      });

      it('should reject invalid URL with quotes', () => {
        const link = 'https://example.com/path"quoted"';
        expect((component as any).validateLink(link)).toBe(false);
      });
    });

    describe('with subtypeValue.link prefix', () => {
      beforeEach(() => {
        component.renderingSubType = 'ror';
        fixture.detectChanges();
      });

      it('should validate link that already starts with subtypeValue.link', () => {
        const link = 'https://ror.org/123abc';
        expect((component as any).validateLink(link)).toBe(true);
      });

      it('should validate link that is exactly subtypeValue.link', () => {
        const link = 'https://ror.org';
        expect((component as any).validateLink(link)).toBe(true);
      });

      it('should reject link that does not start with subtypeValue.link', () => {
        const link = '123abc';
        expect((component as any).validateLink(link)).toBe(false);
      });

      it('should not validate partial match of subtypeValue.link', () => {
        const link = 'ror.example.com';
        expect((component as any).validateLink(link)).toBe(false);
      });
    });

    describe('composeLink with validateLink', () => {
      beforeEach(() => {
        component.renderingSubType = 'ror';
        fixture.detectChanges();
      });

      it('should not prepend subtypeValue.link if link already has it', () => {
        const link = 'https://ror.org/123abc';
        const result = component.composeLink(link, 'ror');
        expect(result.href).toBe('https://ror.org/123abc');
        expect(result.text).toBe('https://ror.org/123abc');
      });

      it('should prepend subtypeValue.link if link does not have it', () => {
        const link = '123abc';
        const result = component.composeLink(link, 'ror');
        expect(result.href).toBe('https://ror.org/123abc');
        expect(result.text).toBe('123abc');
      });

      it('should handle complete URLs with different domain', () => {
        const link = 'https://example.com/123abc';
        const result = component.composeLink(link, 'ror');
        expect(result.href).toBe('https://example.com/123abc');
        expect(result.text).toBe('https://example.com/123abc');
      });
    });
  });

});
