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
import {HostWindowService, WidthCategory} from '../shared/host-window.service';
import {HostWindowServiceStub} from '../shared/testing/host-window-service.stub';


describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadcrumbsServiceMock: BreadcrumbsService;

  const expectBreadcrumb = (listItem: DebugElement, text: string, url: string) => {
    const anchor = listItem.query(By.css('a'));

    if (url == null ) {
      expect(anchor).toBeNull();
      expect(listItem.nativeElement.innerHTML).toEqual(text);
    } else {
      expect(anchor).toBeInstanceOf(DebugElement);
      if (anchor.attributes?.href) {
        expect(anchor.attributes.href).toEqual(url);
      }
      expect(anchor.nativeElement.innerHTML).toEqual(text);
    }
  };

  beforeEach(waitForAsync(() => {
    breadcrumbsServiceMock = {
      breadcrumbs$: observableOf([
        // NOTE: a root breadcrumb is automatically rendered
        new Breadcrumb('bc 1', 'example.com'),
        new Breadcrumb('bc 2', 'another.com'),
        new Breadcrumb('bc 3', 'another.com')
      ]),
      showBreadcrumbs$: observableOf(true),
    } as BreadcrumbsService;

    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        VarDirective,
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
        { provide: HostWindowService, useValue: new HostWindowServiceStub(WidthCategory.SM) }
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
    expect(breadcrumbs.length).toBe(5);
    expectBreadcrumb(breadcrumbs[0], '...', '/');
    expectBreadcrumb(breadcrumbs[1], 'home.breadcrumbs', '/');
    expectBreadcrumb(breadcrumbs[2], 'bc 1', '/example.com');
    expectBreadcrumb(breadcrumbs[3], 'bc 2', '/another.com');
    expectBreadcrumb(breadcrumbs[4].query(By.css('.text-truncate')), 'bc 3', null);
  });

});
