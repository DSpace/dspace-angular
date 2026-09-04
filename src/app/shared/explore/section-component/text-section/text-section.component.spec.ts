import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Site } from '@dspace/core/shared/site.model';
import { of } from 'rxjs';
import { SearchService } from 'src/app/shared/search/search.service';

import { MarkdownViewerComponent } from '../../../markdown-viewer/markdown-viewer.component';
import { TextSectionComponent } from './text-section.component';

describe('TextSectionComponent', () => {
  let component: TextSectionComponent;
  let fixture: ComponentFixture<TextSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TextSectionComponent],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: LocaleService, useValue: { getCurrentLanguageCode: () => of('en') } },
      ],
    })
      .overrideComponent(TextSectionComponent, { remove: { imports: [MarkdownViewerComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSectionComponent);
    component = fixture.componentInstance;
    component.site  = Object.assign(new Site(), {
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
  // FIXME: complete scenarios
  it('should render text-metadata with ds-markdown-viewer', () => {
    component.sectionId = 'site';
    fixture.detectChanges();
    const dsMarkdownViewer = fixture.debugElement.query(By.css('[data-test="ds-markdown-viewer"]'));
    expect(dsMarkdownViewer).toBeTruthy();
  });
});
