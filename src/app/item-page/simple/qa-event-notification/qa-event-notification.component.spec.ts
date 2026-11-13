import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { RequestService } from '@dspace/core/data/request.service';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { QualityAssuranceSourceObject } from '@dspace/core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceSourceDataService } from '@dspace/core/notifications/qa/source/quality-assurance-source-data.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { HALEndpointServiceStub } from '@dspace/core/testing/hal-endpoint-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SplitPipe } from 'src/app/shared/utils/split.pipe';

import { QaEventNotificationComponent } from './qa-event-notification.component';

describe('QaEventNotificationComponent', () => {
  let component: QaEventNotificationComponent;
  let fixture: ComponentFixture<QaEventNotificationComponent>;
  let qualityAssuranceSourceDataServiceStub: any;
  let authService: jasmine.SpyObj<AuthService>;
  let authorizationService: jasmine.SpyObj<AuthorizationDataService>;

  const obj = Object.assign(new QualityAssuranceSourceObject(), {
    id: 'sourceName:target',
    source: 'sourceName',
    target: 'target',
    totalEvents: 1,
  });

  const objPL = createSuccessfulRemoteDataObject$(createPaginatedList([obj]));
  const item = Object.assign({ uuid: '1234' });
  beforeEach(async () => {

    qualityAssuranceSourceDataServiceStub = {
      getSourcesByTarget: jasmine.createSpy('getSourcesByTarget').and.returnValue(objPL),
    };
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), QaEventNotificationComponent, SplitPipe],
      providers: [
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: RequestService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('test') },
        ObjectCacheService,
        RemoteDataBuildService,
        provideMockStore({}),
      ],
    })
      // the component declares its own provider for this service, so it has to be overridden on the component
      .overrideComponent(QaEventNotificationComponent, {
        set: {
          providers: [
            { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(QaEventNotificationComponent);
    component = fixture.componentInstance;
    component.item = item;
    component.sources$ = of([obj]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sources if present', () => {
    const alertElements = fixture.debugElement.queryAll(By.css('.alert'));
    expect(alertElements.length).toBe(1);
  });

  it('should return the quality assurance route when getQualityAssuranceRoute is called', () => {
    const route = component.getQualityAssuranceRoute();
    expect(route).toBe('/notifications/quality-assurance');
  });

  describe('getQualityAssuranceSources$', () => {
    it('should request the sources when the user is authenticated and the QA feature is available', (done) => {
      component.getQualityAssuranceSources$().subscribe((sources) => {
        expect(authorizationService.isAuthorized).toHaveBeenCalledWith(FeatureID.CanSeeQA);
        expect(qualityAssuranceSourceDataServiceStub.getSourcesByTarget).toHaveBeenCalled();
        expect(sources).toEqual([obj]);
        done();
      });
    });

    it('should not send any request when the user is not authenticated', (done) => {
      authService.isAuthenticated.and.returnValue(of(false));

      component.getQualityAssuranceSources$().subscribe((sources) => {
        expect(authorizationService.isAuthorized).not.toHaveBeenCalled();
        expect(qualityAssuranceSourceDataServiceStub.getSourcesByTarget).not.toHaveBeenCalled();
        expect(sources).toEqual([]);
        done();
      });
    });

    it('should not request the sources when the QA feature is not available', (done) => {
      authorizationService.isAuthorized.and.returnValue(of(false));

      component.getQualityAssuranceSources$().subscribe((sources) => {
        expect(qualityAssuranceSourceDataServiceStub.getSourcesByTarget).not.toHaveBeenCalled();
        expect(sources).toEqual([]);
        done();
      });
    });
  });
});
