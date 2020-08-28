import { of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { METADATA_EXPORT_SCRIPT_NAME, ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import { Item } from '../../../../core/shared/item.model';
import { ProcessParameter } from '../../../../process-page/processes/process-parameter.model';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { ExportMetadataSelectorComponent } from './export-metadata-selector.component';

// No way to add entryComponents yet to testbed; alternative implemented; source: https://stackoverflow.com/questions/41689468/how-to-shallow-test-a-component-with-an-entrycomponents
@NgModule({
  imports: [ NgbModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderMock
      }
    }),
  ],
  exports: [],
  declarations: [ConfirmationModalComponent],
  providers: [],
  entryComponents: [ConfirmationModalComponent],
})
class ModelTestModule { }

describe('ExportMetadataSelectorComponent', () => {
  let component: ExportMetadataSelectorComponent;
  let fixture: ComponentFixture<ExportMetadataSelectorComponent>;
  let debugElement: DebugElement;
  let modalRef;

  let router;
  let notificationService: NotificationsServiceStub;
  let scriptService;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018'
  });

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    name: 'test-collection-1',
    handle: 'fake/test-collection-1',
  });

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    handle: 'fake/test-community-1',
  });

  const itemRD = createSuccessfulRemoteDataObject(mockItem);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  beforeEach(async(() => {
    notificationService = new NotificationsServiceStub();
    router = jasmine.createSpyObj('router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    });
    scriptService = jasmine.createSpyObj('scriptService',
      {
        invoke: observableOf({
          response:
            {
              isSuccessful: true,
              resourceSelfLinks: ['https://localhost:8080/api/core/processes/45']
            }
        })
      }
    );
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), ModelTestModule],
      declarations: [ExportMetadataSelectorComponent],
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
    fixture = TestBed.createComponent(ExportMetadataSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const modalService = TestBed.get(NgbModal);
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
        done()
      });
    });
    it('should not invoke metadata-export script', () => {
      expect(scriptService.invoke).not.toHaveBeenCalled();
    });
  });

  describe('if collection is selected', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      component.navigate(mockCollection).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done()
      });
    });
    it('metadata-export script is invoked with its -i handle and -f uuid.csv', () => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '-i', value: mockCollection.handle }),
        Object.assign(new ProcessParameter(), { name: '-f', value: mockCollection.uuid + '.csv' }),
      ];
      expect(scriptService.invoke).toHaveBeenCalledWith(METADATA_EXPORT_SCRIPT_NAME, parameterValues, []);
    });
    it('success notification is shown', () => {
      expect(scriptRequestSucceeded).toBeTrue();
      expect(notificationService.success).toHaveBeenCalled();
    });
    it('redirected to process page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/45');
    });
  });

  describe('if community is selected', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      component.navigate(mockCommunity).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done()
      });
    });
    it('metadata-export script is invoked with its -i handle and -f uuid.csv', () => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '-i', value: mockCommunity.handle }),
        Object.assign(new ProcessParameter(), { name: '-f', value: mockCommunity.uuid + '.csv' }),
      ];
      expect(scriptService.invoke).toHaveBeenCalledWith(METADATA_EXPORT_SCRIPT_NAME, parameterValues, []);
    });
    it('success notification is shown', () => {
      expect(scriptRequestSucceeded).toBeTrue();
      expect(notificationService.success).toHaveBeenCalled();
    });
    it('redirected to process page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/45');
    });
  });

  describe('if community/collection is selected; but script invoke fails', () => {
    let scriptRequestSucceeded;
    beforeEach((done) => {
      spyOn((component as any).modalService, 'open').and.returnValue(modalRef);
      jasmine.getEnv().allowRespy(true);
      spyOn(scriptService, 'invoke').and.returnValue(observableOf({
        response:
          {
            isSuccessful: false,
          }
      }));
      component.navigate(mockCommunity).subscribe((succeeded: boolean) => {
        scriptRequestSucceeded = succeeded;
        done()
      });
    });
    it('error notification is shown', () => {
      expect(scriptRequestSucceeded).toBeFalse();
      expect(notificationService.error).toHaveBeenCalled();
    });
  });

});
