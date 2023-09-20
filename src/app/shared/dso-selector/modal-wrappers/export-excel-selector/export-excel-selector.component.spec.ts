import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router.stub';
import { Collection } from '../../../../core/shared/collection.model';
import { ExportExcelSelectorComponent } from './export-excel-selector.component';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { RequestService } from '../../../../core/data/request.service';
import { ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { Process } from '../../../../process-page/processes/process.model';


describe('ExportExcelSelectorComponent', () => {
  let component: ExportExcelSelectorComponent;
  let fixture: ComponentFixture<ExportExcelSelectorComponent>;
  let debugElement: DebugElement;

  const collection = new Collection();
  collection.uuid = '1234-1234-1234-1234';
  collection.id = '1234-1234-1234-1234';
  collection.metadata = {
    'dc.title': [Object.assign(new MetadataValue(), {
      value: 'Collection title',
      language: undefined
    })]
  };
  let componentAsAny: any;
  const router = new RouterStub();
  const collectionRD = createSuccessfulRemoteDataObject(collection);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  let requestService: any;
  let scriptDataService: any;


  beforeEach(waitForAsync(() => {

    requestService = jasmine.createSpyObj('RequestService', {
      removeByHrefSubstring: jasmine.createSpy('removeByHrefSubstring')
    });
    scriptDataService = jasmine.createSpyObj('ScriptDataService', {
      invoke: createSuccessfulRemoteDataObject$(new Process())
    });


    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ExportExcelSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: collectionRD,
                },
              },
            }
          },
        },
        {
          provide: Router, useValue: router
        },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: RequestService, useValue: requestService },
        { provide: ScriptDataService, useValue: scriptDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportExcelSelectorComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke script process', () => {
    spyOn(componentAsAny, 'navigateToProcesses').and.callThrough();
    component.navigate(collection);

    expect(componentAsAny.notificationService.success).toHaveBeenCalled();
    expect(componentAsAny.navigateToProcesses).toHaveBeenCalled();
    expect(requestService.removeByHrefSubstring).toHaveBeenCalled();
  });
});
