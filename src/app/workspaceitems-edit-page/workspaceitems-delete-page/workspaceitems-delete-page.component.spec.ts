import { RouteService } from '../../core/services/route.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { RouterMock } from '../../shared/mocks/router.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { of as observableOf } from 'rxjs';
import { routeServiceStub } from '../../shared/testing/route-service.stub';
import { LocationStub } from '../../shared/testing/location.stub';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

describe('WorkspaceitemsDeletePageComponent', () => {
  let component: WorkspaceItemsDeletePageComponent;
  let fixture: ComponentFixture<WorkspaceItemsDeletePageComponent>;

  const workspaceitemDataServiceSpy = jasmine.createSpyObj('WorkspaceitemDataService', {
    delete: observableOf(createSuccessfulRemoteDataObject({}))
  });

  const wsi = new WorkspaceItem();
  wsi.id = '1234';
  const dso = new DSpaceObject();
  dso.uuid = '1234';

  const translateServiceStub = {
    get: () => observableOf('test-message'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  const modalService = {
    open: () => {/** empty */},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [WorkspaceItemsDeletePageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(
            {},
            {
              wsi: createSuccessfulRemoteDataObject(wsi),
              dso: createSuccessfulRemoteDataObject(dso),
            }
          ),
        },
        { provide: Router, useValue: new RouterMock() },
        {
          provide: WorkspaceitemDataService,
          useValue: workspaceitemDataServiceSpy,
        },
        { provide: Location, useValue: new LocationStub() },
        { provide: NgbModal, useValue: modalService },
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

  /*it('should delete the target workspace item', () => {
    spyOn((component as any).modalService, 'open').and.returnValue({});
    component.confirmDelete(By.css('#delete-modal'));
    fixture.detectChanges();
    expect((component as any).modalService.open).toHaveBeenCalled();
  });*/

  it('should call workspaceItemService.delete', () => {
    component.sendDeleteRequest();
    expect((component as any).workspaceItemService.delete).toHaveBeenCalledWith('1234');
  });
});
