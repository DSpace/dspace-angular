import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of as observableOf } from 'rxjs';

import { ViewMode } from '../../core/shared/view-mode.model';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { ObjectDetailComponent } from '../object-detail/object-detail.component';
import { ObjectGridComponent } from '../object-grid/object-grid.component';
import { ThemedObjectListComponent } from '../object-list/themed-object-list.component';
import { RouterStub } from '../testing/router.stub';
import { ThemeService } from '../theme-support/theme.service';
import { ObjectCollectionComponent } from './object-collection.component';

describe('ObjectCollectionComponent', () => {
  let fixture: ComponentFixture<ObjectCollectionComponent>;
  let objectCollectionComponent: ObjectCollectionComponent;

  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const activatedRouteStub = {
    queryParams: observableOf({
      query: queryParam,
      scope: scopeParam,
    }),
  };
  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectCollectionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useClass: RouterStub },
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
    objectCollectionComponent.currentMode$ = observableOf(ViewMode.GridElement);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('ds-object-grid'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('ds-object-list'))).toBeNull();
  });

  it('should only show the list component when the viewmode is set to list', () => {
    objectCollectionComponent.currentMode$ = observableOf(ViewMode.ListElement);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('ds-object-list'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('ds-object-grid'))).toBeNull();
  });

  it('should set fallback placeholder font size during test', async () => {
    objectCollectionComponent.currentMode$ = observableOf(ViewMode.ListElement);
    fixture.detectChanges();

    const comp = fixture.debugElement.query(By.css('ds-object-list'));
    expect(comp).not.toBeNull();
    expect(comp.nativeElement.classList).not.toContain('hide-placeholder-text');
  });
});
