import {
  NO_ERRORS_SCHEMA,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ItemDataService } from '../../../../modules/core/src/lib/core/data/item-data.service';
import { getMockTranslateService } from '../../../../modules/core/src/lib/core/mocks/translate.service.mock';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { ActivatedRouteStub } from '../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { NotificationsServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { RouterStub } from '../../../../modules/core/src/lib/core/utilities/testing/router.stub';
import { SubmissionServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/submission-service.stub';
import { mockSubmissionObject } from '../../shared/mocks/submission.mock';
import { SubmissionService } from '../submission.service';
import { SubmissionSubmitComponent } from './submission-submit.component';

describe('SubmissionSubmitComponent Component', () => {

  let comp: SubmissionSubmitComponent;
  let fixture: ComponentFixture<SubmissionSubmitComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let itemDataService: ItemDataService;
  let router: RouterStub;

  const submissionObject: any = mockSubmissionObject;

  beforeEach(waitForAsync(() => {
    itemDataService = jasmine.createSpyObj('itemDataService', {
      findByHref: createSuccessfulRemoteDataObject$(submissionObject.item),
    });
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: '', component: SubmissionSubmitComponent, pathMatch: 'full' },
        ]),
        SubmissionSubmitComponent,
      ],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ViewContainerRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSubmitComponent);
    comp = fixture.componentInstance;
    submissionServiceStub = TestBed.inject(SubmissionService as any);
    router = TestBed.inject(Router as any);
  });

  afterEach(() => {
    comp = null;
    fixture = null;
    router = null;
  });

  it('should redirect to mydspace when an empty SubmissionObject has been retrieved',() => {

    submissionServiceStub.createSubmission.and.returnValue(observableOf({}));

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/mydspace']);

  });

  it('should redirect to workspaceitem edit when a not empty SubmissionObject has been retrieved',() => {

    submissionServiceStub.createSubmission.and.returnValue(observableOf({ id: '1234' }));

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/workspaceitems', '1234', 'edit'], { replaceUrl: true });

  });

  it('should not has effects when an invalid SubmissionObject has been retrieved',() => {

    submissionServiceStub.createSubmission.and.returnValue(observableOf(null));

    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(comp.collectionId).toBeUndefined();
    expect(comp.selfUrl).toBeUndefined();
    expect(comp.submissionDefinition).toBeUndefined();
  });

});
