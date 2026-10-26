import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { SiteDataServiceStub } from 'src/app/shared/site-data-service.stub';
import { StatisticsCategoriesServiceStub } from 'src/app/shared/statistics-category-service.stub';
import { UsageReportServiceStub } from 'src/app/shared/usage-report-service.stub';

import { AuthService } from '../../core/auth/auth.service';
import { SiteDataService } from '../../core/data/site-data.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { UsageReport } from '../../core/statistics/models/usage-report.model';
import { StatisticsState } from '../../core/statistics/statistics.reducer';
import { StatisticsCategoriesDataService } from '../../core/statistics/statistics-categories-data.service';
import { UsageReportDataService } from '../../core/statistics/usage-report-data.service';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { CrisStatisticsPageComponent } from './cris-statistics-page.component';
import { StatisticsChartComponent } from './statistics-chart/statistics-chart.component';
import { StatisticsMapComponent } from './statistics-map/statistics-map.component';

describe('CrisStatisticsPageComponent', () => {

  const initialState: StatisticsState = { reportId: '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits', categoryId: 'mainReports' };
  let component: CrisStatisticsPageComponent;
  let fixture: ComponentFixture<CrisStatisticsPageComponent>;
  let de: DebugElement;

  const authServiceStub = new AuthServiceStub();
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    data: of({
      scope: Object.assign(new DSpaceObject(), {
        '_name': 'CRIS',
        'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
        'uuid': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
        'type': 'community',
      }),
    }),
  });

  const validationScope = Object.assign(new DSpaceObject(), {
    '_name': 'CRIS',
    'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
    'uuid': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
    'type': 'community',
  });

  const usageReportServiceStub = new UsageReportServiceStub();
  const statisticsCategoriesServiceStub = new StatisticsCategoriesServiceStub();
  const siteDataServiceStub = new SiteDataServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'fake-url',
            redirectTo: '/',
          },
        ]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CrisStatisticsPageComponent,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UsageReportDataService, useValue: usageReportServiceStub },
        { provide: StatisticsCategoriesDataService, useValue: statisticsCategoriesServiceStub },
        { provide: SiteDataService, useValue: siteDataServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CrisStatisticsPageComponent, { remove: { imports: [ThemedLoadingComponent, StatisticsMapComponent, StatisticsChartComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisStatisticsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check if can get categories information and view change', () => {
    expect(de.query(By.css('#categories-tabs'))).toBeNull();
  });

  it('check if can get scope information', (done: DoneFn) => {
    component.ngOnInit();
    fixture.detectChanges();
    activatedRouteStub.data.subscribe( (data) => {
      expect(data.scope).toEqual(validationScope);
      done();
    });
  });

  it('check if can get categories information and view changed', () => {
    component.categories$ = statisticsCategoriesServiceStub.searchStatistics('url', 1, 1);
    component.categories$.subscribe((data) => {
      component.selectedCategory = data[0];
    });
    fixture.detectChanges();
    expect(de.query(By.css('#categories-tabs'))).toBeTruthy();
  });

  it('check rendered categories length', () => {
    component.categories$ = statisticsCategoriesServiceStub.searchStatistics('url', 1, 1);
    component.categories$.subscribe((data) => {
      component.selectedCategory = data[0];
    });
    fixture.detectChanges();
    const renderedCategories = fixture.debugElement.queryAll(By.css('#categories-tabs li'));
    expect(renderedCategories.length).toEqual(2);
  });

  it('check rendered categories has active class accrording to state', () => {
    component.categories$ = statisticsCategoriesServiceStub.searchStatistics('url', 1, 1);
    component.categories$.subscribe((data) => {
      component.selectedCategory = data[0];
    });
    fixture.detectChanges();
    const renderedCategories = fixture.debugElement.queryAll(By.css('#categories-tabs li a'));
    expect(renderedCategories[0].nativeElement.classList.contains('active')).toBe(true);
  });

  it('should set selectedReportId to the first report id if no reportType query param is present', () => {
    const category = { id: 'category1' };
    const reports = [{ id: 'report1', reportType: 'type1' }, { id: 'report2', reportType: 'type2' }];
    spyOn(component, 'getReports$').and.returnValue(of(reports as UsageReport[]));
    spyOn(component, 'getReportId').and.returnValue(of(null));
    spyOn(component, 'getCategoryId').and.returnValue(of(null));
    spyOn(component, 'setStatisticsState');

    component.getUserReports(category);

    expect(component.setStatisticsState).toHaveBeenCalledWith('report1', 'category1');
    expect(component.selectedReportId).toBe('report1');
  });

  it('should set selectedReportId to the report id matching the reportType query param', () => {
    const category = { id: 'category1' };
    const reports = [{ id: 'report1', reportType: 'type1' }, { id: 'report2', reportType: 'type2' }];
    spyOn(component, 'getReports$').and.returnValue(of(reports as UsageReport[]));
    spyOn(component, 'getReportId').and.returnValue(of(null));
    spyOn(component, 'getCategoryId').and.returnValue(of(null));
    spyOn(component, 'setStatisticsState');

    component.getUserReports(category, 'type2');

    expect(component.setStatisticsState).toHaveBeenCalledWith('report2', 'category1');
    expect(component.selectedReportId).toBe('report2');
  });

  it('should set selectedReportId to the first report id if reportType query param does not match any report', () => {
    const category = { id: 'category1' };
    const reports = [{ id: 'report1', reportType: 'type1' }, { id: 'report2', reportType: 'type2' }];
    spyOn(component, 'getReports$').and.returnValue(of(reports as UsageReport[]));
    spyOn(component, 'getReportId').and.returnValue(of(null));
    spyOn(component, 'getCategoryId').and.returnValue(of(null));
    spyOn(component, 'setStatisticsState');

    component.getUserReports(category, 'non_existing_type');

    expect(component.setStatisticsState).toHaveBeenCalledWith('report1', 'category1');
    expect(component.selectedReportId).toBe('report1');
  });

  it('should set selectedReportId and categoryId from state if they exist', () => {
    const category = { id: 'category1' };
    const reports = [{ id: 'report1', reportType: 'type1' }, { id: 'report2', reportType: 'type2' }];
    spyOn(component, 'getReports$').and.returnValue(of(reports as UsageReport[]));
    spyOn(component, 'getReportId').and.returnValue(of('report1'));
    spyOn(component, 'getCategoryId').and.returnValue(of('category1'));
    spyOn(component, 'setStatisticsState');

    component.getUserReports(category);

    expect(component.setStatisticsState).toHaveBeenCalledWith('report1', 'category1');
  });

  it('should handle null category gracefully', () => {
    spyOn(component, 'getReports$').and.returnValue(of([]));
    spyOn(component, 'getReportId').and.returnValue(of(null));
    spyOn(component, 'getCategoryId').and.returnValue(of(null));
    spyOn(component, 'setStatisticsState');

    component.getUserReports(null);

    expect(component.setStatisticsState).not.toHaveBeenCalled();
    expect(component.selectedReportId).toBeUndefined();
  });

  it('should emit null on selectedFullReport$ before loading the new report', () => {
    const category = { id: 'category1' };
    const reports = [{ id: 'report1', reportType: 'type1' }];
    spyOn(component, 'getReports$').and.returnValue(of(reports as UsageReport[]));
    spyOn(component, 'getReportId').and.returnValue(of(null));
    spyOn(component, 'getCategoryId').and.returnValue(of(null));
    spyOn(component, 'setStatisticsState');

    const emitted: (UsageReport | null)[] = [];
    (component as any).selectedFullReport$.subscribe((value) => emitted.push(value));

    component.getUserReports(category);

    // first emitted value is the initial null from the BehaviorSubject,
    // second is the reset to null done at the start of getUserReports
    expect(emitted[0]).toBeNull();
    expect(emitted[1]).toBeNull();
  });

  describe('loadFullReport', () => {

    beforeEach(() => {
      (component as any).fullReportCache.clear();
      (component as any).inFlightRequests.clear();
    });

    it('should return of(null) and reset currentReportId when reportId is falsy', (done: DoneFn) => {
      (component as any).currentReportId = 'something';

      component.loadFullReport(null).subscribe((result) => {
        expect(result).toBeNull();
        expect((component as any).currentReportId).toBeNull();
        done();
      });
    });

    it('should return the cached report without calling the service when present in cache', (done: DoneFn) => {
      const reportId = '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits';
      const cachedReport = { id: reportId } as UsageReport;
      (component as any).fullReportCache.set(reportId, cachedReport);
      spyOn(usageReportServiceStub, 'findReport').and.callThrough();

      component.loadFullReport(reportId).subscribe((result) => {
        expect(result).toBe(cachedReport);
        expect(usageReportServiceStub.findReport).not.toHaveBeenCalled();
        done();
      });
    });

    it('should call usageReportService.findReport when the report is not cached', (done: DoneFn) => {
      const reportId = '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits';
      spyOn(usageReportServiceStub, 'findReport').and.callThrough();

      component.loadFullReport(reportId).subscribe((result) => {
        expect(usageReportServiceStub.findReport).toHaveBeenCalledWith(reportId, null, null);
        expect(result.id).toBe(reportId);
        expect((component as any).currentReportId).toBe(reportId);
        done();
      });
    });

    it('should reuse the same observable for concurrent requests of the same reportId', () => {
      const reportId = '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits';
      spyOn(usageReportServiceStub, 'findReport').and.callThrough();

      const first$ = component.loadFullReport(reportId);
      const second$ = component.loadFullReport(reportId);

      expect(first$).toBe(second$);
      expect(usageReportServiceStub.findReport).toHaveBeenCalledTimes(1);
    });

  });

  describe('setReportId', () => {

    beforeEach(() => {
      (component as any).fullReportCache.clear();
    });

    it('should cache the report and update selectedFullReport$ when reportId matches currentReportId', () => {
      const reportId = 'report1';
      const report = { id: reportId } as UsageReport;
      (component as any).currentReportId = reportId;

      (component as any).setReportId(report, reportId);

      expect((component as any).fullReportCache.get(reportId)).toBe(report);
      expect((component as any).selectedFullReport$.value).toBe(report);
    });

    it('should not update selectedFullReport$ when reportId does not match currentReportId (stale response)', () => {
      const report = { id: 'oldReport' } as UsageReport;
      (component as any).currentReportId = 'newerReport';
      (component as any).selectedFullReport$.next(null);

      (component as any).setReportId(report, 'oldReport');

      expect((component as any).selectedFullReport$.value).toBeNull();
      // it is still cached for later reuse even if stale
      expect((component as any).fullReportCache.get('oldReport')).toBe(report);
    });

    it('should not cache a null/falsy report', () => {
      (component as any).currentReportId = 'report1';

      (component as any).setReportId(null, 'report1');

      expect((component as any).fullReportCache.has('report1')).toBe(false);
      expect((component as any).selectedFullReport$.value).toBeNull();
    });

  });

  describe('changeReport', () => {

    it('should update statistics state, selectedReportId and selectedFullReport$', (done: DoneFn) => {
      const reportId = '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits';
      spyOn(component, 'getCategoryId').and.returnValue(of('category1'));
      spyOn(component, 'setStatisticsState');

      component.changeReport(reportId);

      (component as any).selectedFullReport$.subscribe((report: UsageReport) => {
        if (report) {
          expect(component.setStatisticsState).toHaveBeenCalledWith(reportId, 'category1');
          expect(component.selectedReportId).toBe(reportId);
          expect(report.id).toBe(reportId);
          done();
        }
      });
    });

    it('should emit null on selectedFullReport$ before loading the new report', () => {
      spyOn(component, 'getCategoryId').and.returnValue(of('category1'));
      spyOn(component, 'setStatisticsState');

      const emitted: (UsageReport | null)[] = [];
      (component as any).selectedFullReport$.subscribe((value) => emitted.push(value));

      component.changeReport('1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits');

      expect(emitted[0]).toBeNull();
      expect(emitted[1]).toBeNull();
    });

  });

  describe('clearFullReportCache', () => {

    it('should clear caches, reset currentReportId and emit null on selectedFullReport$', () => {
      (component as any).fullReportCache.set('r1', { id: 'r1' } as UsageReport);
      (component as any).inFlightRequests.set('r1', of({ id: 'r1' } as UsageReport));
      (component as any).currentReportId = 'r1';

      (component as any).clearFullReportCache();

      expect((component as any).fullReportCache.size).toBe(0);
      expect((component as any).inFlightRequests.size).toBe(0);
      expect((component as any).currentReportId).toBeNull();
      expect((component as any).selectedFullReport$.value).toBeNull();
    });

  });

});
