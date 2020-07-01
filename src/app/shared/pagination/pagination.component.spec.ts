// Load the implementations that should be tested
import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement
} from '@angular/core';

import {
  async,
  ComponentFixture,
  inject,
  TestBed, fakeAsync, tick
} from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { NgxPaginationModule } from 'ngx-pagination';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import Spy = jasmine.Spy;

import { PaginationComponent } from './pagination.component';
import { PaginationComponentOptions } from './pagination-component-options.model';

import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { HostWindowServiceMock } from '../mocks/host-window-service.mock';
import { MockActivatedRoute } from '../mocks/active-router.mock';
import { RouterMock } from '../mocks/router.mock';

import { HostWindowService } from '../host-window.service';
import { EnumKeysPipe } from '../utils/enum-keys-pipe';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';

import { createTestComponent } from '../testing/utils.test';
import { storeModuleConfig } from '../../app.reducer';

function expectPages(fixture: ComponentFixture<any>, pagesDef: string[]): void {
  const de = fixture.debugElement.query(By.css('.pagination'));
  const pages = de.nativeElement.querySelectorAll('li');

  expect(pages.length).toEqual(pagesDef.length);

  for (let i = 0; i < pagesDef.length; i++) {
    const pageDef = pagesDef[i];
    const classIndicator = pageDef.charAt(0);

    if (classIndicator === '+') {
      expect(pages[i].classList.contains('active')).toBeTruthy();
      expect(pages[i].classList.contains('disabled')).toBeFalsy();
      expect(normalizeText(pages[i].textContent)).toEqual(normalizeText(pageDef));
    } else if (classIndicator === '-') {
      expect(pages[i].classList.contains('active')).toBeFalsy();
      expect(pages[i].classList.contains('disabled')).toBeTruthy();
      expect(normalizeText(pages[i].textContent)).toEqual(normalizeText(pageDef));
      if (normalizeText(pages[i].textContent) !== '...') {
        expect(pages[i].querySelector('a').getAttribute('tabindex')).toEqual('-1');
      }
    } else {
      expect(pages[i].classList.contains('active')).toBeFalsy();
      expect(pages[i].classList.contains('disabled')).toBeFalsy();
      expect(normalizeText(pages[i].textContent)).toEqual(normalizeText(pageDef));
      if (normalizeText(pages[i].textContent) !== '...') {
        expect(pages[i].querySelector('a').hasAttribute('tabindex')).toBeFalsy();
      }
    }
  }
}

function changePageSize(fixture: ComponentFixture<any>, pageSize: string): void {
  const buttonEl = fixture.nativeElement.querySelector('#paginationControls');

  buttonEl.click();

  const dropdownMenu = fixture.debugElement.query(By.css('#paginationControlsDropdownMenu'));
  const buttons = dropdownMenu.nativeElement.querySelectorAll('button');

  for (const button of buttons) {
    if (button.textContent.trim() === pageSize) {
      button.click();
      fixture.detectChanges();
      break;
    }
  }
}

function changePage(fixture: ComponentFixture<any>, idx: number): void {
  const de = fixture.debugElement.query(By.css('.pagination'));
  const buttons = de.nativeElement.querySelectorAll('li');

  buttons[idx].querySelector('a').click();
  fixture.detectChanges();
}

function normalizeText(txt: string): string {
  const matches = txt.match(/([0-9«»]|\.{3})/);
  return matches ? matches[0] : '';
}

describe('Pagination component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let html;
  let hostWindowServiceStub: HostWindowServiceMock;

  let activatedRouteStub: MockActivatedRoute;
  let routerStub: RouterMock;

  // Define initial state and test state
  const _initialState = { width: 1600, height: 770 };

  // async beforeEach
  beforeEach(async(() => {
    activatedRouteStub = new MockActivatedRoute();
    routerStub = new RouterMock();
    hostWindowServiceStub = new HostWindowServiceMock(_initialState.width);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NgxPaginationModule,
        NgbModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: TestComponent }
        ])],
      declarations: [
        PaginationComponent,
        TestComponent,
        EnumKeysPipe
      ], // declare the test component
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: HostWindowService, useValue: hostWindowServiceStub },
        ChangeDetectorRef,
        PaginationComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
    <ds-pagination #p='paginationComponent'
                   [paginationOptions]='paginationOptions'
                   [sortOptions]='sortOptions'
                   [collectionSize]='collectionSize'
                   (pageChange)='pageChanged($event)'
                   (pageSizeChange)='pageSizeChanged($event)'>
      <ul>
        <li *ngFor='let item of collection | paginate: { itemsPerPage: paginationOptions.pageSize,
                    currentPage: paginationOptions.currentPage, totalItems: collectionSize }'> {{item}} </li>
      </ul>
    </ds-pagination>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;

  });

  it('should create Pagination Component', inject([PaginationComponent], (app: PaginationComponent) => {
    expect(app).toBeDefined();
  }));

  it('should render', () => {
    expect(testComp.paginationOptions.id).toEqual('test');
    expect(testComp.paginationOptions.currentPage).toEqual(1);
    expect(testComp.paginationOptions.pageSize).toEqual(10);
    expectPages(testFixture, ['-« Previous', '+1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '» Next']);
  });

  it('should render and respond to page change', () => {
    testComp.collectionSize = 30;

    changePage(testFixture, 3);
    expectPages(testFixture, ['« Previous', '1', '2', '+3', '-» Next']);

    changePage(testFixture, 0);
    expectPages(testFixture, ['« Previous', '1', '+2', '3', '» Next']);
  });

  it('should render and respond to collectionSize change', () => {

    testComp.collectionSize = 30;
    testFixture.detectChanges();
    expectPages(testFixture, ['-« Previous', '+1', '2', '3', '» Next']);

    testComp.collectionSize = 40;
    testFixture.detectChanges();
    expectPages(testFixture, ['-« Previous', '+1', '2', '3', '4', '» Next']);
  });

  it('should render and respond to pageSize change', () => {
    const paginationComponent: PaginationComponent = testFixture.debugElement.query(By.css('ds-pagination')).references.p;

    testComp.collectionSize = 30;
    testFixture.detectChanges();
    expectPages(testFixture, ['-« Previous', '+1', '2', '3', '» Next']);

    paginationComponent.setPageSize(5);
    testFixture.detectChanges();
    expectPages(testFixture, ['-« Previous', '+1', '2', '3', '4', '5', '6', '» Next']);

    paginationComponent.setPageSize(10);
    testFixture.detectChanges();
    expectPages(testFixture, ['-« Previous', '+1', '2', '3', '» Next']);

    paginationComponent.setPageSize(20);
    testFixture.detectChanges();
    expectPages(testFixture, ['-« Previous', '+1', '2', '» Next']);
  });

  it('should emit pageChange event with correct value', fakeAsync(() => {
    const paginationComponent: PaginationComponent = testFixture.debugElement.query(By.css('ds-pagination')).references.p;

    spyOn(testComp, 'pageChanged');

    paginationComponent.setPage(3);
    tick();

    expect(testComp.pageChanged).toHaveBeenCalledWith(3);
  }));

  it('should emit pageSizeChange event with correct value', fakeAsync(() => {
    const paginationComponent: PaginationComponent = testFixture.debugElement.query(By.css('ds-pagination')).references.p;

    spyOn(testComp, 'pageSizeChanged');

    paginationComponent.setPageSize(5);
    tick();

    expect(testComp.pageSizeChanged).toHaveBeenCalledWith(5);
  }));

  it('should set correct page route parameters', fakeAsync(() => {
    routerStub = testFixture.debugElement.injector.get(Router) as any;

    testComp.collectionSize = 60;

    changePage(testFixture, 3);
    tick();
    expect(routerStub.navigate).toHaveBeenCalledWith([], { queryParams: { pageId: 'test', page: '3', pageSize: 10, sortDirection: 'ASC', sortField: 'dc.title' }, queryParamsHandling: 'merge' });

  }));

  it('should set correct pageSize route parameters', fakeAsync(() => {
    routerStub = testFixture.debugElement.injector.get(Router) as any;

    testComp.collectionSize = 60;

    changePageSize(testFixture, '20');
    tick();
    expect(routerStub.navigate).toHaveBeenCalledWith([], { queryParams: { pageId: 'test', page: 1, pageSize: 20, sortDirection: 'ASC', sortField: 'dc.title' } , queryParamsHandling: 'merge' });
  }));

  it('should set correct values', fakeAsync(() => {
    const paginationComponent: PaginationComponent = testFixture.debugElement.query(By.css('ds-pagination')).references.p;
    routerStub = testFixture.debugElement.injector.get(Router) as any;

    testComp.collectionSize = 60;

    paginationComponent.setPage(3);
    expect(paginationComponent.currentPage).toEqual(3);

    paginationComponent.setPageSize(20);
    expect(paginationComponent.pageSize).toEqual(20);
  }));

  it('should get parameters from route', () => {

    activatedRouteStub = testFixture.debugElement.injector.get(ActivatedRoute) as any;
    activatedRouteStub.testParams = {
      pageId: 'test',
      page: 2,
      pageSize: 20
    };

    testFixture.detectChanges();

    expectPages(testFixture, ['« Previous', '1', '+2', '3', '4', '5', '» Next']);
    expect(testComp.paginationOptions.currentPage).toEqual(2);
    expect(testComp.paginationOptions.pageSize).toEqual(20);

    activatedRouteStub.testParams = {
      pageId: 'test',
      page: 3,
      pageSize: 40
    };

    testFixture.detectChanges();

    expectPages(testFixture, ['« Previous', '1', '2', '+3', '-» Next']);
    expect(testComp.paginationOptions.currentPage).toEqual(3);
    expect(testComp.paginationOptions.pageSize).toEqual(40);
  });

  it('should respond to windows resize', () => {
    const paginationComponent: PaginationComponent = testFixture.debugElement.query(By.css('ds-pagination')).references.p;
    hostWindowServiceStub = testFixture.debugElement.injector.get(HostWindowService) as any;

    hostWindowServiceStub.setWidth(400);

    hostWindowServiceStub.isXs().subscribe((status) => {
      paginationComponent.isXs = status;
      testFixture.detectChanges();
      expectPages(testFixture, ['-« Previous', '+1', '2', '3', '4', '5', '-...', '10', '» Next']);
      de = testFixture.debugElement.query(By.css('ul.pagination'));
      expect(de.nativeElement.classList.contains('pagination-sm')).toBeTruthy();
    });
  });
});

// declare a test component
@Component({ selector: 'ds-test-cmp', template: '' })
class TestComponent {

  collection: string[] = [];
  collectionSize: number;
  paginationOptions = new PaginationComponentOptions();
  sortOptions = new SortOptions('dc.title', SortDirection.ASC);

  constructor() {
    this.collection = Array.from(new Array(100), (x, i) => `item ${i + 1}`);
    this.collectionSize = 100;
    this.paginationOptions.id = 'test';
  }

  pageChanged(page) {
    this.paginationOptions.currentPage = page;
  }

  pageSizeChanged(pageSize) {
    this.paginationOptions.pageSize = pageSize;
  }
}
