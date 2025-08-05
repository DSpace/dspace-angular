import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { SubmissionJsonPatchOperationsService } from '@dspace/core/submission/submission-json-patch-operations.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { SectionsServiceStub } from '@dspace/core/testing/sections-service.stub';
import { SubmissionJsonPatchOperationsServiceStub } from '@dspace/core/testing/submission-json-patch-operations-service.stub';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { getMockThemeService } from '../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { SubmissionFormComponent } from '../form/submission-form.component';
import { SectionsService } from '../sections/sections.service';
import { SubmissionService } from '../submission.service';
import { mockSubmissionObject } from '../utils/submission.mock';
import { SubmissionEditComponent } from './submission-edit.component';

describe('SubmissionEditComponent Component', () => {

  let comp: SubmissionEditComponent;
  let fixture: ComponentFixture<SubmissionEditComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let itemDataService: ItemDataService;
  let submissionJsonPatchOperationsServiceStub: SubmissionJsonPatchOperationsServiceStub;
  let router: RouterStub;
  let halService: jasmine.SpyObj<HALEndpointService>;

  let themeService = getMockThemeService();

  const submissionId = '826';
  const route: ActivatedRouteStub = new ActivatedRouteStub();
  const submissionObject: any = mockSubmissionObject;

  beforeEach(waitForAsync(() => {
    itemDataService = jasmine.createSpyObj('itemDataService', {
      findByHref: createSuccessfulRemoteDataObject$(submissionObject.item),
    });

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: of('fake-url'),
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: ':id/edit', component: SubmissionEditComponent, pathMatch: 'full' },
        ]),
        SubmissionEditComponent,
      ],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SubmissionJsonPatchOperationsService, useClass: SubmissionJsonPatchOperationsServiceStub },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: route },
        { provide: AuthService, useValue: new AuthServiceStub() },
        { provide: HALEndpointService, useValue: halService },
        { provide: SectionsService, useValue: new SectionsServiceStub() },
        { provide: ThemeService, useValue: themeService },
        { provide: XSRFService, useValue: {} },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(SubmissionEditComponent, {
      remove: {
        imports: [ SubmissionFormComponent ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionEditComponent);
    comp = fixture.componentInstance;
    submissionServiceStub = TestBed.inject(SubmissionService as any);
    submissionJsonPatchOperationsServiceStub = TestBed.inject(SubmissionJsonPatchOperationsService as any);
    router = TestBed.inject(Router as any);
  });

  afterEach(() => {
    if (fixture) {
      // Ensure Angular cleans up the component properly
      fixture.destroy();
    }
    comp = null;
    fixture = null;
    router = null;
  });

  it('should init properly when a valid SubmissionObject has been retrieved',() => {

    route.testParams = { id: submissionId };
    submissionServiceStub.retrieveSubmission.and.returnValue(
      createSuccessfulRemoteDataObject$(submissionObject),
    );
    submissionServiceStub.getSubmissionObject.and.returnValue(of(submissionObject));
    submissionServiceStub.getSubmissionStatus.and.returnValue(of(true));


    fixture.detectChanges();

    expect(comp.submissionId).toBe(submissionId);
    expect(comp.collectionId).toBe(submissionObject.collection.id);
    expect(comp.selfUrl).toBe(submissionObject._links.self.href);
    expect(comp.sections).toBe(submissionObject.sections);
    expect(comp.submissionDefinition).toBe(submissionObject.submissionDefinition);

  });

  it('should redirect to mydspace when an empty SubmissionObject has been retrieved',() => {

    route.testParams = { id: submissionId };
    submissionServiceStub.retrieveSubmission.and.returnValue(createSuccessfulRemoteDataObject$({}),
    );

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();

  });

  it('should not has effects when an invalid SubmissionObject has been retrieved',() => {

    route.testParams = { id: submissionId };
    submissionServiceStub.retrieveSubmission.and.returnValue(of(null));

    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(comp.collectionId).toBeUndefined();
    expect(comp.selfUrl).toBeUndefined();
    expect(comp.sections).toBeUndefined();
    expect(comp.submissionDefinition).toBeUndefined();
  });

  describe('ngOnDestroy', () => {
    it('should call delete pending json patch operations', fakeAsync(() => {

      submissionJsonPatchOperationsServiceStub.deletePendingJsonPatchOperations.and.callFake(() => { /* */ });
      comp.ngOnDestroy();

      expect(submissionJsonPatchOperationsServiceStub.deletePendingJsonPatchOperations).toHaveBeenCalled();
    }));

  });


});
