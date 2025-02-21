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

import { AuthService } from '../../../../modules/core/src/lib/core/auth/auth.service';
import { DSONameService } from '../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../../../modules/core/src/lib/core/data/dspace-object-data.service';
import { Community } from '../../../../modules/core/src/lib/core/shared/community.model';
import { UsageReport } from '../../../../modules/core/src/lib/core/statistics/models/usage-report.model';
import { UsageReportDataService } from '../../../../modules/core/src/lib/core/statistics/usage-report-data.service';
import { createSuccessfulRemoteDataObject } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { CommunityStatisticsPageComponent } from './community-statistics-page.component';

describe('CommunityStatisticsPageComponent', () => {

  let component: CommunityStatisticsPageComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<CommunityStatisticsPageComponent>;

  beforeEach(waitForAsync(() => {

    const activatedRoute = {
      data: observableOf({
        scope: createSuccessfulRemoteDataObject(
          Object.assign(new Community(), {
            id: 'community_id',
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
        CommunityStatisticsPageComponent,
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
    fixture = TestBed.createComponent(CommunityStatisticsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve to the correct community', () => {
    expect(de.query(By.css('.header')).nativeElement.id)
      .toEqual('community_id');
  });

  it('should show a statistics table for each usage report', () => {
    expect(de.query(By.css('ds-statistics-table.community_id-TotalVisits-report')).nativeElement)
      .toBeTruthy();
    expect(de.query(By.css('ds-statistics-table.community_id-TotalVisitsPerMonth-report')).nativeElement)
      .toBeTruthy();
    expect(de.query(By.css('ds-statistics-table.community_id-TopCountries-report')).nativeElement)
      .toBeTruthy();
    expect(de.query(By.css('ds-statistics-table.community_id-TopCities-report')).nativeElement)
      .toBeTruthy();
  });
});
