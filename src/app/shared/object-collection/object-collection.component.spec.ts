import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { ViewMode } from '../../core/shared/view-mode.model';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { ObjectDetailComponent } from '../object-detail/object-detail.component';
import { ObjectGridComponent } from '../object-grid/object-grid.component';
import { ThemedObjectListComponent } from '../object-list/themed-object-list.component';
import { SearchConfigurationServiceStub } from '../testing/search-configuration-service.stub';
import { ThemeService } from '../theme-support/theme.service';
import { ObjectCollectionComponent } from './object-collection.component';

describe('ObjectCollectionComponent', () => {
  let fixture: ComponentFixture<ObjectCollectionComponent>;
  let objectCollectionComponent: ObjectCollectionComponent;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectCollectionComponent],
      providers: [
        { provide: ThemeService, useValue: getMockThemeService() },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObjectCollectionComponent, {
        remove: {
          imports: [ ThemedObjectListComponent, ObjectGridComponent, ObjectDetailComponent],
        },
      })
      .compileComponents();  // compile template and css
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectCollectionComponent);
    objectCollectionComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should only show the grid component when the viewmode is set to grid', () => {
    objectCollectionComponent.currentMode$ = of(ViewMode.GridElement);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('ds-object-grid'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('ds-object-list'))).toBeNull();
  });

  it('should only show the list component when the viewmode is set to list', () => {
    objectCollectionComponent.currentMode$ = of(ViewMode.ListElement);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('ds-object-list'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('ds-object-grid'))).toBeNull();
  });

  it('should set fallback placeholder font size during test', async () => {
    objectCollectionComponent.currentMode$ = of(ViewMode.ListElement);
    fixture.detectChanges();

    const comp = fixture.debugElement.query(By.css('ds-object-list'));
    expect(comp).not.toBeNull();
    expect(comp.nativeElement.classList).not.toContain('hide-placeholder-text');
  });

  it('should default to list view when no view query param is present', (done) => {
    objectCollectionComponent.currentMode$.subscribe((mode) => {
      expect(mode).toBe(ViewMode.ListElement);
      done();
    });
  });
});

describe('ObjectCollectionComponent view mode', () => {
  let fixture: ComponentFixture<ObjectCollectionComponent>;
  let objectCollectionComponent: ObjectCollectionComponent;
  let searchConfigService: SearchConfigurationServiceStub;

  function init(viewMode?: ViewMode) {
    TestBed.resetTestingModule();
    const providers: any[] = [
      { provide: ThemeService, useValue: getMockThemeService() },
      provideMockStore(),
    ];
    if (viewMode) {
      searchConfigService = new SearchConfigurationServiceStub();
      spyOn(searchConfigService, 'getCurrentViewMode').and.returnValue(of(viewMode));
      providers.push({ provide: SEARCH_CONFIG_SERVICE, useValue: searchConfigService });
    }
    TestBed.configureTestingModule({
      imports: [ObjectCollectionComponent],
      providers,
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObjectCollectionComponent, {
        remove: {
          imports: [ ThemedObjectListComponent, ObjectGridComponent, ObjectDetailComponent],
        },
      });
    fixture = TestBed.createComponent(ObjectCollectionComponent);
    objectCollectionComponent = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should default to list view when SEARCH_CONFIG_SERVICE is not provided', (done) => {
    init();
    objectCollectionComponent.currentMode$.subscribe((mode) => {
      expect(mode).toBe(ViewMode.ListElement);
      done();
    });
  });

  it('should get the current view mode from SearchConfigurationService', (done) => {
    init(ViewMode.GridElement);
    objectCollectionComponent.currentMode$.subscribe((mode) => {
      expect(mode).toBe(ViewMode.GridElement);
      expect(searchConfigService.getCurrentViewMode).toHaveBeenCalledWith(ViewMode.ListElement);
      done();
    });
  });
});
