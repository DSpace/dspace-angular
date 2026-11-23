import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Site } from '@dspace/core/shared/site.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { MarkdownViewerComponent } from '../../../markdown-viewer/markdown-viewer.component';
import { SearchService } from '../../../search/search.service';
import { TextSectionComponent } from './text-section.component';

describe('TextSectionComponent', () => {
  let component: TextSectionComponent;
  let fixture: ComponentFixture<TextSectionComponent>;

  const localeServiceStub = {
    getCurrentLanguageCode() {
      return of('en');
    },
  };

  const createSite = (): Site => Object.assign(new Site(), {
    id: 'test-site',
    _links: {
      self: { href: 'test-site-href' },
    },
    metadata: {
      'cms.homepage.footer': [
        {
          language: 'en',
          value: '1234',
        },
      ],
      'dc.description': [
        {
          language: 'en_US',
          value: 'desc',
        },
      ],
    },
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TextSectionComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: LocaleService, useValue: localeServiceStub },
      ],
    })
      .overrideComponent(TextSectionComponent, { remove: { imports: [MarkdownViewerComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSectionComponent);
    component = fixture.componentInstance;
    component.site = createSite();
    component.textRowSection = {
      content: 'cms.homepage.footer',
      contentType: 'text-metadata',
      componentType: 'text-row',
      style: '',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the contentType is text-metadata', () => {
    beforeEach(() => {
      component.sectionId = 'site';
      component.textRowSection = {
        content: 'cms.homepage.footer',
        contentType: 'text-metadata',
        componentType: 'text-row',
        style: '',
      };
      fixture.detectChanges();
    });

    it('should render a ds-markdown-viewer', () => {
      const dsMarkdownViewer = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]'));
      expect(dsMarkdownViewer).toBeTruthy();
    });

    it('should pass the resolved metadata value to the ds-markdown-viewer', () => {
      const dsMarkdownViewer = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]'));
      expect(dsMarkdownViewer.properties.value).toEqual('1234');
    });

    it('should not add the home-news class when content is not dspace.cms.home-news', () => {
      const wrapper = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]')).parent;
      expect(wrapper.nativeElement.classList).not.toContain('text-section-home-news');
    });

    it('should add the home-news class when content is dspace.cms.home-news', () => {
      component.textRowSection = {
        content: 'dspace.cms.home-news',
        contentType: 'text-metadata',
        componentType: 'text-row',
        style: '',
      };
      fixture.detectChanges();
      const wrapper = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]')).parent;
      expect(wrapper.nativeElement.classList).toContain('text-section-home-news');
    });
  });

  describe('when the contentType is image', () => {
    beforeEach(() => {
      component.textRowSection = {
        content: 'https://example.com/logo.png',
        contentType: 'image',
        componentType: 'text-row',
        style: '',
      };
      fixture.detectChanges();
    });

    it('should render an img with the content as src', () => {
      const img = fixture.debugElement.query(By.css('img'));
      expect(img).toBeTruthy();
      expect(img.nativeElement.getAttribute('src')).toEqual('https://example.com/logo.png');
    });

    it('should not render a ds-markdown-viewer', () => {
      const dsMarkdownViewer = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]'));
      expect(dsMarkdownViewer).toBeNull();
    });
  });

  describe('when the contentType is text-key', () => {
    beforeEach(() => {
      component.textRowSection = {
        content: 'my-key',
        contentType: 'text-key',
        componentType: 'text-row',
        style: '',
      };
      fixture.detectChanges();
    });

    it('should render the translated key', () => {
      const div = fixture.debugElement.query(By.css('div'));
      expect(div.nativeElement.textContent.trim()).toEqual('explore.text-section.my-key');
    });
  });

  describe('when the contentType is text-raw', () => {
    beforeEach(() => {
      component.textRowSection = {
        content: 'Some raw text',
        contentType: 'text-raw',
        componentType: 'text-row',
        style: '',
      };
      fixture.detectChanges();
    });

    it('should render the raw content', () => {
      const div = fixture.debugElement.query(By.css('div'));
      expect(div.nativeElement.textContent.trim()).toEqual('Some raw text');
    });
  });

  describe('when the contentType is custom', () => {
    beforeEach(() => {
      component.textRowSection = {
        content: '',
        contentType: 'custom',
        componentType: 'text-row',
        style: '',
      };
      fixture.detectChanges();
    });

    it('should not render an image, markdown viewer or plain text', () => {
      expect(fixture.debugElement.query(By.css('img'))).toBeNull();
      expect(fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]'))).toBeNull();
    });
  });

  describe('metadataValue', () => {
    it('should return the first metadata value for the current language', () => {
      let value: string;
      component.metadataValue('cms.homepage.footer').subscribe((result) => value = result);
      expect(value).toEqual('1234');
    });

    it('should return an empty string when the metadata field does not exist', () => {
      let value: string;
      component.metadataValue('dc.title').subscribe((result) => value = result);
      expect(value).toEqual('');
    });

    it('should return an empty string when the site is not set', () => {
      component.site = undefined;
      let value: string;
      component.metadataValue('cms.homepage.footer').subscribe((result) => value = result);
      expect(value).toEqual('');
    });
  });
});
