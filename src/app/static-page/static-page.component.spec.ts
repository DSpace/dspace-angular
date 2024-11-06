import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticPageComponent } from './static-page.component';
import { HtmlContentService } from '../shared/html-content.service';
import { Router } from '@angular/router';
import { RouterMock } from '../shared/mocks/router.mock';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { APP_CONFIG } from '../../config/app-config.interface';
import { environment } from '../../environments/environment';
import { ClarinSafeHtmlPipe } from '../shared/utils/clarin-safehtml.pipe';

describe('StaticPageComponent', () => {
  let component: StaticPageComponent;
  let fixture: ComponentFixture<StaticPageComponent>;

  let htmlContentService: HtmlContentService;
  let appConfig: any;

  const htmlContent = '<div id="idShouldNotBeRemoved">TEST MESSAGE</div>';

  beforeEach(async () => {
    htmlContentService = jasmine.createSpyObj('htmlContentService', {
      fetchHtmlContent: of(htmlContent),
      getHmtlContentByPathAndLocale: Promise.resolve(htmlContent)
    });

    appConfig = Object.assign(environment, {
      ui: {
        namespace: 'testNamespace'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ StaticPageComponent, ClarinSafeHtmlPipe ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: HtmlContentService, useValue: htmlContentService },
        { provide: Router, useValue: new RouterMock() },
        { provide: APP_CONFIG, useValue: appConfig }
      ]
    });

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Load `TEST MESSAGE`
  it('should load html file content', async () => {
    await component.ngOnInit();
    expect(component.htmlContent.value).toBe('<div id="idShouldNotBeRemoved">TEST MESSAGE</div>');
  });
});
