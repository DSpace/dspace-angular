import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { RequestService } from '../../../core/data/request.service';
import { RequestEntry } from '../../../core/data/request-entry.model';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { Process } from '../../../process-page/processes/process.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { NotificationsService } from '../../notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { ExportCollectionMenuComponent } from './export-collection-menu.component';

describe('ExportCollectionMenuComponent', () => {
  let component: ExportCollectionMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ExportCollectionMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;
  let authorizationService: any;
  let requestService: any;
  let router: any;
  let scriptDataService: any;

  const notificationService = new NotificationsServiceStub();
  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Collection(), {
      id: 'test-collection',
      _links: {
        self: { href: 'test-collection-selflink' },
      },
    });

    authorizationService = jasmine.createSpyObj('AuthorizationDataService', {
      isAuthorized: jasmine.createSpy('isAuthorized'),
    });
    requestService = jasmine.createSpyObj('RequestService', {
      removeByHrefSubstring: jasmine.createSpy('removeByHrefSubstring'),
    });
    router = jasmine.createSpyObj('Router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    });
    scriptDataService = jasmine.createSpyObj('ScriptDataService', {
      invoke: jasmine.createSpy('invoke'),
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ExportCollectionMenuComponent,
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.COLLECTION },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: router },
        { provide: RequestService, useValue: requestService },
        { provide: ScriptDataService, useValue: scriptDataService },
        { provide: NotificationsService, useValue: notificationService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(ExportCollectionMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  describe('when the user is collection admin', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });

    it('should invoke script process', () => {
      const requestEntry = Object.assign(new RequestEntry(), {
        response: {
          isSuccessful: true,
        },
      });
      scriptDataService.invoke.and.returnValue(createSuccessfulRemoteDataObject$(new Process()));
      spyOn(componentAsAny, 'navigateToProcesses').and.callThrough();

      scheduler.schedule(() => component.exportCollection());
      scheduler.flush();

      expect(componentAsAny.notificationService.success).toHaveBeenCalled();
      expect(componentAsAny.navigateToProcesses).toHaveBeenCalled();
    });
  });

  describe('when the user is not collection admin', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render a link', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });

});
