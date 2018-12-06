import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ViewModeSwitchComponent } from './view-mode-switch.component';
import { ViewMode } from '../../core/shared/view-mode.model';
import { MockTranslateLoader } from '../mocks/mock-translate-loader';
import { SearchServiceStub } from '../testing/search-service-stub';
import { SearchService } from '../../+search-page/search-service/search.service';

@Component({ template: '' })
class DummyComponent { }

describe('ViewModeSwitchComponent', () => {
  let comp: ViewModeSwitchComponent;
  let fixture: ComponentFixture<ViewModeSwitchComponent>;
  const searchService = new SearchServiceStub();
  let listButton: HTMLElement;
  let gridButton: HTMLElement;
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
        { provide: SearchService, useValue: searchService },
      ],
    }).overrideComponent(ViewModeSwitchComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModeSwitchComponent);
    comp = fixture.componentInstance; // ViewModeSwitchComponent test instance
    fixture.detectChanges();
    const debugElements = fixture.debugElement.queryAll(By.css('a'));
    listButton = debugElements[0].nativeElement;
    gridButton = debugElements[1].nativeElement;
  });

  it('should set list button as active when on list mode', fakeAsync(() => {
    searchService.setViewMode(ViewMode.List);
    tick();
    fixture.detectChanges();
    expect(comp.currentMode).toBe(ViewMode.List);
    expect(listButton.classList).toContain('active');
    expect(gridButton.classList).not.toContain('active');
  }));

  it('should set grid button as active when on grid mode', fakeAsync(() => {
    searchService.setViewMode(ViewMode.Grid);
    tick();
    fixture.detectChanges();
    expect(comp.currentMode).toBe(ViewMode.Grid);
    expect(listButton.classList).not.toContain('active');
    expect(gridButton.classList).toContain('active');
  }));
});
