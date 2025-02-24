import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DSONameService,
  Item,
  NotificationsService,
  NotificationsServiceStub,
  RemoteData,
  RequestEntryState,
  SupervisionOrderDataService,
  supervisionOrderEntryMock,
  URLCombiner,
  WorkspaceItem,
} from '@dspace/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ConfirmationModalComponent } from '../../../../../shared/confirmation-modal/confirmation-modal.component';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { getWorkspaceItemDeleteRoute } from '../../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import { SupervisionOrderGroupSelectorComponent } from './supervision-order-group-selector/supervision-order-group-selector.component';
import { WorkspaceItemAdminWorkflowActionsComponent } from './workspace-item-admin-workflow-actions.component';

describe('WorkspaceItemAdminWorkflowActionsComponent', () => {
  let component: WorkspaceItemAdminWorkflowActionsComponent;
  let fixture: ComponentFixture<WorkspaceItemAdminWorkflowActionsComponent>;
  let id;
  let wsi;
  let item = new Item();
  item.uuid = 'itemUUID1111';
  const rd = new RemoteData(undefined, undefined, undefined, RequestEntryState.Success, undefined, item, 200);
  let supervisionOrderDataService;
  let notificationService: NotificationsServiceStub;

  function init() {
    notificationService = new NotificationsServiceStub();
    supervisionOrderDataService = jasmine.createSpyObj('supervisionOrderDataService', {
      searchByItem: jasmine.createSpy('searchByItem'),
      delete: jasmine.createSpy('delete'),
    });
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    wsi = new WorkspaceItem();
    wsi.id = id;
    wsi.item = of(rd);
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        WorkspaceItemAdminWorkflowActionsComponent,
      ],
      providers: [
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: NotificationsService, useValue: notificationService },
        { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceItemAdminWorkflowActionsComponent);
    component = fixture.componentInstance;
    component.wsi = wsi;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a delete button with the correct link', () => {
    const button = fixture.debugElement.query(By.css('a.delete-link'));
    const link = button.nativeElement.href;
    expect(link).toContain(new URLCombiner(getWorkspaceItemDeleteRoute(wsi.id)).toString());
  });

  it('should render a policies button with the correct link', () => {
    const a = fixture.debugElement.query(By.css('a.policies-link'));
    const link = a.nativeElement.href;
    expect(link).toContain(new URLCombiner('/items/itemUUID1111/edit/authorizations').toString());
  });

  describe('deleteSupervisionOrder', () => {

    beforeEach(() => {
      spyOn(component.delete, 'emit');
      spyOn((component as any).modalService, 'open').and.returnValue({
        componentInstance: { response: of(true) },
      });
    });

    describe('when delete succeeded', () => {

      beforeEach(() => {
        supervisionOrderDataService.delete.and.returnValue(of(true));
      });

      it('should notify success', () => {
        component.deleteSupervisionOrder(supervisionOrderEntryMock);
        expect((component as any).modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        expect(notificationService.success).toHaveBeenCalled();
        expect(component.delete.emit).toHaveBeenCalled();
      });

    });

    describe('when delete failed', () => {

      beforeEach(() => {
        supervisionOrderDataService.delete.and.returnValue(of(false));
      });

      it('should notify success', () => {
        component.deleteSupervisionOrder(supervisionOrderEntryMock);
        expect((component as any).modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
        expect(notificationService.error).toHaveBeenCalled();
        expect(component.delete.emit).not.toHaveBeenCalled();
      });

    });

  });

  describe('openSupervisionModal', () => {

    beforeEach(() => {
      spyOn(component.create, 'emit');
      spyOn((component as any).modalService, 'open').and.returnValue({
        componentInstance: { create: of(true) },
      });
    });

    it('should emit create event properly', () => {
      component.openSupervisionModal();
      expect((component as any).modalService.open).toHaveBeenCalledWith(SupervisionOrderGroupSelectorComponent, {
        size: 'lg',
        backdrop: 'static',
      });
      expect(component.create.emit).toHaveBeenCalled();
    });
  });


});
