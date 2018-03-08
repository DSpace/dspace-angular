import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockTranslateLoader } from '../mocks/mock-translate-loader';
import { RouterTestingModule } from '@angular/router/testing';

import { Component } from '@angular/core';

import { SearchService } from '../../+search-page/search-service/search.service';
import { ItemDataService } from './../../core/data/item-data.service';
import { ViewModeSwitchComponent } from './view-mode-switch.component';
import { ViewMode } from '../../+search-page/search-options.model';
import { RouteService } from '../route.service';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { RequestService } from '../../core/data/request.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL_CONFIG } from '../../../config';
import { ActivatedRouteStub } from '../testing/active-router-stub';

@Component({ template: '' })
class DummyComponent { }

describe('ViewModeSwitchComponent', () => {
  let comp: ViewModeSwitchComponent;
  let fixture: ComponentFixture<ViewModeSwitchComponent>;
  let searchService: SearchService;
  let listButton: HTMLElement;
  let gridButton: HTMLElement;
  let route = new ActivatedRouteStub();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
        RouterTestingModule.withRoutes([
          { path: 'search', component: DummyComponent, pathMatch: 'full' },
        ])
      ],
      declarations: [
        ViewModeSwitchComponent,
        DummyComponent
      ],
      providers: [
        { provide: ItemDataService, useValue: {} },
        { provide: RouteService, useValue: {} },
        { provide: ResponseCacheService, useValue: {} },
        { provide: RequestService, useValue: {} },
        { provide: ActivatedRoute, useValue: route },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: GLOBAL_CONFIG, useValue: {} },
        SearchService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModeSwitchComponent);
    comp = fixture.componentInstance; // ViewModeSwitchComponent test instance
    fixture.detectChanges();
    const debugElements = fixture.debugElement.queryAll(By.css('a'));
    listButton = debugElements[0].nativeElement;
    gridButton = debugElements[1].nativeElement;
    searchService = fixture.debugElement.injector.get(SearchService);
  });

  it('should set list button as active when on list mode', fakeAsync(() => {
    searchService.setViewMode(ViewMode.List);
    route = new ActivatedRouteStub([{view: ViewMode.List}])
    tick();
    fixture.detectChanges();
    expect(comp.currentMode).toBe(ViewMode.List);
    expect(listButton.classList).toContain('active');
    expect(gridButton.classList).not.toContain('active');
  }));

  it('should set grid button as active when on grid mode', fakeAsync(() => {
    searchService.setViewMode(ViewMode.Grid);
    route = new ActivatedRouteStub([{view: ViewMode.Grid}])
    tick();
    fixture.detectChanges();
    expect(comp.currentMode).toBe(ViewMode.Grid);
    expect(listButton.classList).not.toContain('active');
    expect(gridButton.classList).toContain('active');
  }));
});
