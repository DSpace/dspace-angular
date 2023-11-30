import { of as observableOf } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { COLLECTION_EXPORT_SCRIPT_NAME, ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { Item } from '../../../../core/shared/item.model';
import { ProcessParameter } from '../../../../process-page/processes/process-parameter.model';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../../../remote-data.utils';
import { ExportMetadataXlsSelectorComponent } from './export-metadata-xls-selector.component';

// No way to add entryComponents yet to testbed; alternative implemented; source: https://stackoverflow.com/questions/41689468/how-to-shallow-test-a-component-with-an-entrycomponents
@NgModule({
    imports: [NgbModalModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderMock
            }
        }),
    ],
    exports: [],
    declarations: [ConfirmationModalComponent],
    providers: []
})
class ModelTestModule {
}

describe('ExportMetadataXlsSelectorComponent', () => {
  let component: ExportMetadataXlsSelectorComponent;
  let fixture: ComponentFixture<ExportMetadataXlsSelectorComponent>;
  let debugElement: DebugElement;
  let modalRef;

  let router;
  let notificationService: NotificationsServiceStub;
  let scriptService;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018'
  });

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    uuid: 'test-collection-1-1',
    name: 'test-collection-1',
    metadata: {
      'dc.identifier.uri': [
        {
          language: null,
          value: 'fake/test-collection-1'
        }
      ]
    }
  });

  const itemRD = createSuccessfulRemoteDataObject(mockItem);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  beforeEach(waitForAsync(() => {
    notificationService = new NotificationsServiceStub();
    router = jasmine.createSpyObj('router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    });
    scriptService = jasmine.createSpyObj('scriptService',
      {
        invoke: createSuccessfulRemoteDataObject$({ processId: '45' })
      }
    );
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), ModelTestModule],
      declarations: [ExportMetadataXlsSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: NotificationsService, useValue: notificationService },
        { provide: ScriptDataService, useValue: scriptService },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: itemRD,
                },
              },
            }
          },
        },
        {
          provide: Router, useValue: router
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportMetadataXlsSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const modalService = TestBed.inject(NgbModal);
    modalRef = modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.response = observableOf(true);
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
    it('should not invoke collection-export script', () => {
      expect(scriptService.invoke).not.toHaveBeenCalled();
    });
  });

  describe('if collection is selected', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      component.navigate(mockCollection).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done();
      });
    });
    it('should invoke the collection-export script with option -c uuid', () => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '-c', value: mockCollection.uuid }),
      ];
      expect(scriptService.invoke).toHaveBeenCalledWith(COLLECTION_EXPORT_SCRIPT_NAME, parameterValues, []);
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
