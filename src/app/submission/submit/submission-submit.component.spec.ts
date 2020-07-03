import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { SubmissionService } from '../submission.service';
import { SubmissionServiceStub } from '../../shared/testing/submission-service.stub';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { RouterStub } from '../../shared/testing/router.stub';
import { mockSubmissionObject } from '../../shared/mocks/submission.mock';
import { SubmissionSubmitComponent } from './submission-submit.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';

describe('SubmissionSubmitComponent Component', () => {

  let comp: SubmissionSubmitComponent;
  let fixture: ComponentFixture<SubmissionSubmitComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let router: RouterStub;

  const submissionId = '826';
  const submissionObject: any = mockSubmissionObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: '', component: SubmissionSubmitComponent, pathMatch: 'full' },
        ])
      ],
      declarations: [SubmissionSubmitComponent],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ViewContainerRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSubmitComponent);
    comp = fixture.componentInstance;
    submissionServiceStub = TestBed.get(SubmissionService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    comp = null;
    fixture = null;
    router = null;
  });

  it('should init properly when a valid SubmissionObject has been retrieved', fakeAsync(() => {

    submissionServiceStub.createSubmission.and.returnValue(observableOf(submissionObject));

    fixture.detectChanges();

    expect(comp.submissionId.toString()).toEqual(submissionId);
    expect(comp.collectionId).toBe(submissionObject.collection.id);
    expect(comp.selfUrl).toBe(submissionObject._links.self.href);
    expect(comp.sections).toBe(submissionObject.sections);
    expect(comp.submissionDefinition).toBe(submissionObject.submissionDefinition);

  }));

  it('should redirect to mydspace when an empty SubmissionObject has been retrieved', fakeAsync(() => {

    submissionServiceStub.createSubmission.and.returnValue(observableOf({}));

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();

  }));

  it('should not has effects when an invalid SubmissionObject has been retrieved', fakeAsync(() => {

    submissionServiceStub.createSubmission.and.returnValue(observableOf(null));

    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(comp.collectionId).toBeUndefined();
    expect(comp.selfUrl).toBeUndefined();
    expect(comp.submissionDefinition).toBeUndefined();
  }));

});
