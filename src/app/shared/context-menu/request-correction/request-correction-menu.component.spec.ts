import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { of as observableOf, throwError as observableThrow } from 'rxjs';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { RequestCorrectionMenuComponent } from './request-correction-menu.component';
import { SubmissionService } from '../../../submission/submission.service';
import { Item } from '../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { By } from '@angular/platform-browser';

describe('RequestCorrectionMenuComponent', () => {
  let component: RequestCorrectionMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<RequestCorrectionMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;
  let requestService: any;
  let router: any;
  let submissionService: any;
  let authorizationService;
  const ngbModal = jasmine.createSpyObj('modal', ['open']);
  const mockItem: Item = Object.assign(new Item(), {
    id: 'mockitem',
    uuid: 'mockitem',
    metadata: {
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald'
        }
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26'
        }
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title'
        }
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article'
        }
      ]
    }
  });
  const submissionObject = Object.assign(new WorkspaceItem(), {
    id: 'wsi-test-id',
    item: createSuccessfulRemoteDataObject$(mockItem)
  });

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    authorizationService = jasmine.createSpyObj('AuthorizationDataService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });

    requestService = jasmine.createSpyObj('RequestService', {
      removeByHrefSubstring: jasmine.createSpy('removeByHrefSubstring')
    });
    router = jasmine.createSpyObj('Router', {
      navigate: jasmine.createSpy('navigate')
    });
    submissionService = jasmine.createSpyObj('SubmissionService', {
      createSubmissionByItem: jasmine.createSpy('createSubmissionByItem')
    });

    TestBed.configureTestingModule({
      declarations: [ RequestCorrectionMenuComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: router },
        { provide: NgbModal, useValue: ngbModal },
        { provide: SubmissionService, useValue: submissionService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(RequestCorrectionMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  describe('when the user can create correction', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should open modal', () => {
      component.openRequestModal({});
      expect(componentAsAny.modalService.open).toHaveBeenCalled();
    });

    it('should redirect to workspaceitem edit page when correction is created successfully ', () => {
      componentAsAny.submissionService.createSubmissionByItem.and.returnValue(observableOf(submissionObject));
      component.modalRef = {
        close: () => {
          return;
        }
      } as NgbModalRef;
      spyOn(component.modalRef, 'close');

      scheduler.schedule(() => componentAsAny.requestCorrection());
      scheduler.flush();

      expect(componentAsAny.modalRef.close).toHaveBeenCalled();
      expect(componentAsAny.notificationService.success).toHaveBeenCalled();
      expect(componentAsAny.router.navigate).toHaveBeenCalledWith(['workspaceitems', submissionObject.id, 'edit']);
    });

    it('should show notification when correction is created unsuccessfully ', () => {
      componentAsAny.submissionService.createSubmissionByItem.and.returnValue(observableThrow({ statusCode: 403 }));
      component.modalRef = {
        close: () => {
          return;
        }
      } as NgbModalRef;
      spyOn(component.modalRef, 'close');

      scheduler.schedule(() => componentAsAny.requestCorrection());
      scheduler.flush();

      expect(componentAsAny.modalRef.close).toHaveBeenCalled();
      expect(componentAsAny.notificationService.warning).toHaveBeenCalled();
      expect(componentAsAny.router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when the user cannot create correction', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render the button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });
});
