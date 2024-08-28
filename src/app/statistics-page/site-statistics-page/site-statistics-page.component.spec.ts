import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { SiteDataService } from '../../core/data/site-data.service';
import { Site } from '../../core/shared/site.model';
import { UsageReport } from '../../core/statistics/models/usage-report.model';
import { UsageReportDataService } from '../../core/statistics/usage-report-data.service';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { CrisStatisticsPageComponent } from '../cris-statistics-page/cris-statistics-page.component';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { SiteStatisticsPageComponent } from './site-statistics-page.component';

describe('SiteStatisticsPageComponent', () => {

  let component: SiteStatisticsPageComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<SiteStatisticsPageComponent>;

  beforeEach(waitForAsync(() => {

    const activatedRoute = {
    };

    const router = {
    };

    const usageReportService = {
      searchStatistics: () => observableOf([
        Object.assign(
          new UsageReport(), {
            id: `site_id-TotalVisits-report`,
            points: [],
          },
        ),
      ]),
    };

    const nameService = {
      getName: () => observableOf('test dso name'),
    };

    const siteService = {
      find: () => observableOf(Object.assign(new Site(), {
        id: 'site_id',
        _links: {
          self: {
            href: 'test_site_link',
          },
        },
      })),
    };

    const authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        SiteStatisticsPageComponent,
        StatisticsTableComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: UsageReportDataService, useValue: usageReportService },
        { provide: DSpaceObjectDataService, useValue: {} },
        { provide: DSONameService, useValue: nameService },
        { provide: SiteDataService, useValue: siteService },
        { provide: AuthService, useValue: authService },
      ],
    })
      .overrideComponent(SiteStatisticsPageComponent, { remove: { imports: [ThemedLoadingComponent, StatisticsTableComponent, CrisStatisticsPageComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteStatisticsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
