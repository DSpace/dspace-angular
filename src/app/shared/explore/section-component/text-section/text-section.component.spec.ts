import { SearchService } from '../../../../core/shared/search/search.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TextSectionComponent } from './text-section.component';
import { Site } from '../../../../core/shared/site.model';
import { By } from '@angular/platform-browser';
import { LocaleService } from '../../../../core/locale/locale.service';

describe('TextSectionComponent', () => {
  let component: TextSectionComponent;
  let fixture: ComponentFixture<TextSectionComponent>;

  const localeServiceStub = {
    getCurrentLanguageCode(): string {
      return 'en';
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSectionComponent ],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: LocaleService, useValue: localeServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSectionComponent);
    component = fixture.componentInstance;
    component.site  = Object.assign(new Site(), {
      id: 'test-site',
      _links: {
        self: { href: 'test-site-href' }
      },
      metadata: {
        'cms.homepage.footer': [
          {
            language: 'en',
            value: '1234'
          }
        ],
        'dc.description': [
          {
            language: 'en_US',
            value: 'desc'
          }
        ]
      }
    });
    component.textRowSection = {
      content: 'cms.homepage.footer',
      contentType: 'text-metadata',
      componentType: 'text-row',
      style: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // FIXME: complete scenarios
  it('should render text-metadata with ds-markdown-viewer', () => {
    component.sectionId = 'site';
    fixture.detectChanges();
    const dsMarkdownViewer = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]'));
    expect(dsMarkdownViewer).toBeTruthy();
  });
});
