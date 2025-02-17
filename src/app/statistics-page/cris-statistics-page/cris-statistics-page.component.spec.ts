import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of, of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CrisStatisticsPageComponent } from './cris-statistics-page.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { AuthService } from '../../core/auth/auth.service';
import { StatisticsCategoriesDataService } from '../../core/statistics/statistics-categories-data.service';
import { SiteDataService } from '../../core/data/site-data.service';
import { UsageReportDataService } from '../../core/statistics/usage-report-data.service';
import { SharedModule } from '../../shared/shared.module';
import { UsageReportServiceStub } from '../../shared/testing/usage-report-service.stub';
import { StatisticsCategoriesServiceStub } from '../../shared/testing/statistics-category-service.stub';
import { AuthServiceStub } from '../../shared/testing/auth-service.stub';
import { SiteDataServiceStub } from '../../shared/testing/site-data-service.stub';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';

import { provideMockStore } from '@ngrx/store/testing';
import { StatisticsState } from '../../core/statistics/statistics.reducer';
import { UsageReport } from '../../core/statistics/models/usage-report.model';

describe('CrisStatisticsPageComponent', () => {

  const initialState: StatisticsState = { reportId: '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits', categoryId: 'mainReports' };
  let component: CrisStatisticsPageComponent;
  let fixture: ComponentFixture<CrisStatisticsPageComponent>;
  let de: DebugElement;

  const authServiceStub = new AuthServiceStub();
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    data: observableOf({
      scope: Object.assign(new DSpaceObject(), {
          '_name': 'CRIS',
          'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
          'uuid': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
          'type': 'community'
        })
    })
  });

  const validationScope = Object.assign(new DSpaceObject(), {
    '_name': 'CRIS',
    'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
    'uuid': '0aa1fe0c-e173-4a36-a526-5c157dedfc07',
    'type': 'community'
  });

  const usageReportServiceStub = new UsageReportServiceStub();
  const statisticsCategoriesServiceStub = new StatisticsCategoriesServiceStub();
  const siteDataServiceStub = new SiteDataServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [
        RouterTestingModule.withRoutes([
          {
            path: 'fake-url',
            redirectTo: '/',
          },
        ]),
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ CrisStatisticsPageComponent ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UsageReportDataService, useValue: usageReportServiceStub },
        { provide: StatisticsCategoriesDataService, useValue: statisticsCategoriesServiceStub },
        { provide: SiteDataService, useValue: siteDataServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
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

  it('check if can get report information', () => {
      component.reports$ = usageReportServiceStub.searchStatistics('url', 1, 1);
      component.reports$.subscribe((data) => {
        component.selectedReportId = data[0].id;
      });
      fixture.detectChanges();
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

});
