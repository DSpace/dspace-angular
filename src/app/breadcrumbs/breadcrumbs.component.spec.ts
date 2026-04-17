import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';
import { VarDirective } from '../shared/utils/var.directive';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbsService } from './breadcrumbs.service';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadcrumbsServiceMock: BreadcrumbsService;

  const expectBreadcrumb = (listItem: DebugElement, text: string, url: string) => {
    const anchor = listItem.query(By.css('a'));

    if (url == null) {
      expect(anchor).toBeNull();
      expect(listItem.nativeElement.innerHTML).toEqual(text);
    } else {
      expect(anchor).toBeInstanceOf(DebugElement);
      expect(anchor.attributes.href).toEqual(url);
      expect(anchor.nativeElement.innerHTML).toEqual(text);
    }
  };

  beforeEach(waitForAsync(() => {
    breadcrumbsServiceMock = {
      breadcrumbs$: of([
        // NOTE: a root breadcrumb is automatically rendered
        new Breadcrumb('bc 1', 'example.com'),
        new Breadcrumb('bc 2', 'another.com'),
      ]),
      showBreadcrumbs$: of(true),
    } as BreadcrumbsService;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BreadcrumbsComponent,
        VarDirective,
      ],
      providers: [
        { provide: BreadcrumbsService, useValue: breadcrumbsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
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
