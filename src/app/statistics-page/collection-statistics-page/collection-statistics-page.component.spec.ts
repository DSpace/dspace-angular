import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '@dspace/core';
import { DSONameService } from '@dspace/core';
import { DSpaceObjectDataService } from '@dspace/core';
import { Collection } from '@dspace/core';
import { UsageReport } from '@dspace/core';
import { UsageReportDataService } from '@dspace/core';
import { createSuccessfulRemoteDataObject } from '@dspace/core';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { CollectionStatisticsPageComponent } from './collection-statistics-page.component';

describe('CollectionStatisticsPageComponent', () => {

  let component: CollectionStatisticsPageComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<CollectionStatisticsPageComponent>;

  beforeEach(waitForAsync(() => {

    const activatedRoute = {
      data: observableOf({
        scope: createSuccessfulRemoteDataObject(
          Object.assign(new Collection(), {
            id: 'collection_id',
          }),
        ),
      }),
    };

    const router = {
    };

    const usageReportService = {
      getStatistic: (scope, type) => undefined,
    };

    spyOn(usageReportService, 'getStatistic').and.callFake(
      (scope, type) => observableOf(
        Object.assign(
          new UsageReport(), {
            id: `${scope}-${type}-report`,
            points: [],
          },
        ),
      ),
    );

    const nameService = {
      getName: () => observableOf('test dso name'),
    };

    const authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        CollectionStatisticsPageComponent,
        StatisticsTableComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: UsageReportDataService, useValue: usageReportService },
        { provide: DSpaceObjectDataService, useValue: {} },
        { provide: DSONameService, useValue: nameService },
        { provide: AuthService, useValue: authService },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionStatisticsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve to the correct collection', () => {
    expect(de.query(By.css('.header')).nativeElement.id)
      .toEqual('collection_id');
  });

  it('should show a statistics table for each usage report', () => {
    expect(de.query(By.css('ds-statistics-table.collection_id-TotalVisits-report')).nativeElement)
      .toBeTruthy();
    expect(de.query(By.css('ds-statistics-table.collection_id-TotalVisitsPerMonth-report')).nativeElement)
      .toBeTruthy();
    expect(de.query(By.css('ds-statistics-table.collection_id-TopCountries-report')).nativeElement)
      .toBeTruthy();
    expect(de.query(By.css('ds-statistics-table.collection_id-TopCities-report')).nativeElement)
      .toBeTruthy();
  });
});
