import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { VarDirective } from '../shared/utils/var.directive';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { DebugElement } from '@angular/core';
import { IsTextTruncatedPipe } from './breadcrumb/is-text-truncated.pipe';
import { TruncateBreadcrumbItemCharactersPipe } from './breadcrumb/truncate-breadcrumb-item-characters.pipe';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadcrumbsServiceMock: BreadcrumbsService;
  let truncateTextPipe: TruncateBreadcrumbItemCharactersPipe;

  const expectBreadcrumb = (listItem: DebugElement, text: string, url: string) => {
    const anchor = listItem.query(By.css('a'));
    const truncatedText = truncateTextPipe.transform(text);
    if (url == null) {
      expect(anchor).toBeNull();
       // remove leading whitespace characters
      const textWithoutSpaces = listItem.nativeElement.innerHTML.trimStart().replace(/^\s+/, '');
      expect(textWithoutSpaces).toEqual(truncatedText);
    } else {
      expect(anchor).toBeInstanceOf(DebugElement);
      expect(anchor.attributes.href).toEqual(url);
       // remove leading whitespace characters
      const textWithoutSpaces = anchor.nativeElement.innerHTML.trimStart().replace(/^\s+/, '');
      expect(textWithoutSpaces).toEqual(truncatedText);
    }
  };

  beforeEach(waitForAsync(() => {
    breadcrumbsServiceMock = {
      breadcrumbs$: observableOf([
        // NOTE: a root breadcrumb is automatically rendered
        new Breadcrumb('bc 1', 'example.com'),
        new Breadcrumb('bc 2', 'another.com'),
      ]),
      showBreadcrumbs$: observableOf(true),
    } as BreadcrumbsService;

    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        VarDirective,
        IsTextTruncatedPipe,
        TruncateBreadcrumbItemCharactersPipe,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          }
        }),
      ],
      providers: [
        { provide: BreadcrumbsService, useValue: breadcrumbsServiceMock },
        { provide: TruncateBreadcrumbItemCharactersPipe, useClass: TruncateBreadcrumbItemCharactersPipe },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    truncateTextPipe = TestBed.inject(TruncateBreadcrumbItemCharactersPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the breadcrumbs', () => {
    const breadcrumbs = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
    expect(breadcrumbs.length).toBe(3);
    expectBreadcrumb(breadcrumbs[0], 'home.breadcrumbs', '/');
    expectBreadcrumb(breadcrumbs[1], 'bc 1', '/example.com');
    expectBreadcrumb(breadcrumbs[2].query(By.css('.text-truncate')), 'bc 2', null);
  });

});
