import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { CrisStatisticsPageComponent } from './cris-statistics-page.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { of as observableOf } from 'rxjs';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { StatisticsCategoriesService } from '../../core/statistics/statistics-categories.service';
import { SiteDataService } from '../../core/data/site-data.service';
import { UsageReportService } from '../../core/statistics/usage-report-data.service';


import { UsageReportServiceStub } from '../../shared/testing/usage-report-service.stub';
import { StatisticsCategoriesServiceStub } from '../../shared/testing/statistics-category-service.stub';
import { AuthServiceStub } from '../../shared/testing/auth-service.stub';
import { SiteDataServiceStub } from '../../shared/testing/site-data-service.stub';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';


describe('CrisStatisticsPageComponent', () => {
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
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ CrisStatisticsPageComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UsageReportService, useValue: usageReportServiceStub },
        { provide: StatisticsCategoriesService, useValue: statisticsCategoriesServiceStub },
        { provide: SiteDataService, useValue: siteDataServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ]
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

  xit('check if can get categories information and view changed', () => {
      component.categories$ = statisticsCategoriesServiceStub.searchStatistics('url', 1, 1);
      fixture.detectChanges();
      expect(de.query(By.css('categories-tabs'))).toBeTruthy();
  });

  it('check if can get report information', () => {
      component.reports$ = usageReportServiceStub.searchStatistics('url', 1, 1);
      fixture.detectChanges();
  });

});
