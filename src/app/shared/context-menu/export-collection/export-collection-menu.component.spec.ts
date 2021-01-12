import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { ExportCollectionMenuComponent } from './export-collection-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { RequestService } from '../../../core/data/request.service';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { RequestEntry } from '../../../core/data/request.reducer';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { Process } from '../../../process-page/processes/process.model';

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

  beforeEach(async(() => {
    dso = Object.assign(new Collection(), {
      id: 'test-collection',
      _links: {
        self: { href: 'test-collection-selflink' }
      }
    });

    authorizationService = jasmine.createSpyObj('AuthorizationDataService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });
    requestService = jasmine.createSpyObj('RequestService', {
      removeByHrefSubstring: jasmine.createSpy('removeByHrefSubstring')
    });
    router = jasmine.createSpyObj('Router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    });
    scriptDataService = jasmine.createSpyObj('ScriptDataService', {
      invoke: jasmine.createSpy('invoke')
    });

    TestBed.configureTestingModule({
      declarations: [ ExportCollectionMenuComponent ],
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
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.COLLECTION },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: router },
        { provide: RequestService, useValue: requestService },
        { provide: ScriptDataService, useValue: scriptDataService }
      ]
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
          isSuccessful: true
        }
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
