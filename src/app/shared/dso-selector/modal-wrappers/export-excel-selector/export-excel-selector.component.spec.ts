import {
  DebugElement,
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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { RequestService } from '../../../../core/data/request.service';
import { Collection } from '../../../../core/shared/collection.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { Process } from '../../../../process-page/processes/process.model';
import { NotificationsService } from '../../../notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../remote-data.utils';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { RouterStub } from '../../../testing/router.stub';
import { AdministeredCollectionSelectorComponent } from '../../dso-selector/administered-collection-selector/administered-collection-selector.component';
import { ExportExcelSelectorComponent } from './export-excel-selector.component';


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
      language: undefined,
    })],
  };
  let componentAsAny: any;
  const router = new RouterStub();
  const collectionRD = createSuccessfulRemoteDataObject(collection);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  let requestService: any;
  let scriptDataService: any;


  beforeEach(waitForAsync(() => {

    requestService = jasmine.createSpyObj('RequestService', {
      removeByHrefSubstring: jasmine.createSpy('removeByHrefSubstring'),
    });
    scriptDataService = jasmine.createSpyObj('ScriptDataService', {
      invoke: createSuccessfulRemoteDataObject$(new Process()),
    });


    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ExportExcelSelectorComponent],
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
            },
          },
        },
        {
          provide: Router, useValue: router,
        },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: RequestService, useValue: requestService },
        { provide: ScriptDataService, useValue: scriptDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ExportExcelSelectorComponent, { remove: { imports: [AdministeredCollectionSelectorComponent] } }).compileComponents();

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
