import { Location } from '@angular/common';
import {
  EventEmitter,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { RouterMock } from '../../../../modules/core/src/lib/core/mocks/router.mock';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import { RouteService } from '../../../../modules/core/src/lib/core/services/route.service';
import { DSpaceObject } from '../../../../modules/core/src/lib/core/shared/dspace-object.model';
import { WorkspaceItem } from '../../../../modules/core/src/lib/core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../../../modules/core/src/lib/core/submission/workspaceitem-data.service';
import { createSuccessfulRemoteDataObject } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { ActivatedRouteStub } from '../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { LocationStub } from '../../../../modules/core/src/lib/core/utilities/testing/location.stub';
import { NotificationsServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { routeServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/route-service.stub';
import { WorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page.component';

describe('WorkspaceitemsDeletePageComponent', () => {
  let component: WorkspaceItemsDeletePageComponent;
  let fixture: ComponentFixture<WorkspaceItemsDeletePageComponent>;

  const workspaceitemDataServiceSpy = jasmine.createSpyObj('WorkspaceitemDataService', {
    delete: observableOf(createSuccessfulRemoteDataObject({})),
  });

  const wsi = new WorkspaceItem();
  wsi.id = '1234';
  const dso = new DSpaceObject();
  dso.uuid = '1234';

  const translateServiceStub = {
    get: () => observableOf('test-message'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbModalModule,
        TranslateModule.forRoot(),
        WorkspaceItemsDeletePageComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub({}, {
            wsi: createSuccessfulRemoteDataObject(wsi),
            dso: createSuccessfulRemoteDataObject(dso),
          },
          ),
        },
        { provide: Router, useValue: new RouterMock() },
        {
          provide: WorkspaceitemDataService,
          useValue: workspaceitemDataServiceSpy,
        },
        { provide: Location, useValue: new LocationStub() },
        {
          provide: NotificationsService,
          useValue: new NotificationsServiceStub(),
        },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceItemsDeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current WorkspaceItem', () => {
    (component as any).activatedRoute.data.subscribe((data) => {
      expect(data.wsi.payload.id).toEqual('1234');
    });
  });

  it('should delete the target workspace item', () => {
    spyOn((component as any).modalService, 'open').and.returnValue({ result: Promise.resolve('ok') });
    component.confirmDelete(By.css('#delete-modal'));
    fixture.detectChanges();
    expect((component as any).modalService.open).toHaveBeenCalled();
  });

  it('should call workspaceItemService.delete', () => {
    component.sendDeleteRequest();
    expect((component as any).workspaceItemService.delete).toHaveBeenCalledWith('1234');
  });
});
