import {
  DebugElement,
  NgModule,
  NO_ERRORS_SCHEMA,
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
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import {
  BATCH_EXPORT_SCRIPT_NAME,
  ScriptDataService,
} from '@dspace/core/data/processes/script-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { Collection } from '@dspace/core/shared/collection.model';
import { Item } from '@dspace/core/shared/item.model';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { SearchServiceStub } from '@dspace/core/testing/search-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';
import { SearchService } from '../../../search/search.service';
import { ExportBatchSelectorComponent } from './export-batch-selector.component';

// No way to add entryComponents yet to testbed; alternative implemented; source: https://stackoverflow.com/questions/41689468/how-to-shallow-test-a-component-with-an-entrycomponents
@NgModule({
  imports: [NgbModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderMock,
      },
    }), ConfirmationModalComponent],
  exports: [],
  providers: [],
})
class ModelTestModule {
}

describe('ExportBatchSelectorComponent', () => {
  let component: ExportBatchSelectorComponent;
  let fixture: ComponentFixture<ExportBatchSelectorComponent>;
  let debugElement: DebugElement;
  let modalRef;

  let router;
  let notificationService: NotificationsServiceStub;
  let scriptService;
  let authorizationDataService;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
  });

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    uuid: 'test-collection-1-1',
    name: 'test-collection-1',
    metadata: {
      'dc.identifier.uri': [
        {
          language: null,
          value: 'fake/test-collection-1',
        },
      ],
    },
  });
  const itemRD = createSuccessfulRemoteDataObject(mockItem);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  beforeEach(waitForAsync(() => {
    notificationService = new NotificationsServiceStub();
    router = jasmine.createSpyObj('router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    });
    scriptService = jasmine.createSpyObj('scriptService',
      {
        invoke: createSuccessfulRemoteDataObject$({ processId: '45' }),
      },
    );
    authorizationDataService = jasmine.createSpyObj('authorizationDataService', {
      isAuthorized: of(true),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), ModelTestModule, ExportBatchSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: NotificationsService, useValue: notificationService },
        { provide: ScriptDataService, useValue: scriptService },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: SearchService, useValue:  new SearchServiceStub() },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: itemRD,
                },
              },
            },
          },
        },
        {
          provide: Router, useValue: router,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportBatchSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const modalService = TestBed.inject(NgbModal);
    modalRef = modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.response = of(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('if item is selected', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      component.navigate(mockItem).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done();
      });
    });
    it('should not invoke batch-export script', () => {
      expect(scriptService.invoke).not.toHaveBeenCalled();
    });
  });

  describe('if collection is selected and is admin', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      component.navigate(mockCollection).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done();
      });
    });
    it('should invoke the batch-export script with option --id uuid option', () => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '--id', value: mockCollection.uuid }),
        Object.assign(new ProcessParameter(), { name: '--type', value: 'COLLECTION' }),
      ];
      expect(scriptService.invoke).toHaveBeenCalledWith(BATCH_EXPORT_SCRIPT_NAME, parameterValues, []);
    });
    it('success notification is shown', () => {
      expect(scriptRequestSucceeded).toBeTrue();
      expect(notificationService.success).toHaveBeenCalled();
    });
    it('redirected to process page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/45');
    });
  });
  describe('if collection is selected and is not admin', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      (authorizationDataService.isAuthorized as jasmine.Spy).and.returnValue(of(false));
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      component.navigate(mockCollection).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done();
      });
    });
    it('should invoke the Batch-export script with option --id uuid without option', () => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '--id', value: mockCollection.uuid }),
        Object.assign(new ProcessParameter(), { name: '--type', value: 'COLLECTION' }),
      ];
      expect(scriptService.invoke).toHaveBeenCalledWith(BATCH_EXPORT_SCRIPT_NAME, parameterValues, []);
    });
    it('success notification is shown', () => {
      expect(scriptRequestSucceeded).toBeTrue();
      expect(notificationService.success).toHaveBeenCalled();
    });
    it('redirected to process page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/45');
    });
  });

  describe('if collection is selected; but script invoke fails', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      jasmine.getEnv().allowRespy(true);
      spyOn(scriptService, 'invoke').and.returnValue(createFailedRemoteDataObject$('Error', 500));
      component.navigate(mockCollection).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done();
      });
    });
    it('error notification is shown', () => {
      expect(scriptRequestSucceeded).toBeFalse();
      expect(notificationService.error).toHaveBeenCalled();
    });
  });
});
