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
  NgbActiveModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Group } from '../../../../../../core/eperson/models/group.model';
import { SupervisionOrder } from '../../../../../../core/supervision-order/models/supervision-order.model';
import { SupervisionOrderDataService } from '../../../../../../core/supervision-order/supervision-order-data.service';
import { EpersonGroupListComponent } from '../../../../../../shared/eperson-group-list/eperson-group-list.component';
import { NotificationsService } from '../../../../../../shared/notifications/notifications.service';
import { SupervisionOrderGroupSelectorComponent } from './supervision-order-group-selector.component';

describe('SupervisionOrderGroupSelectorComponent', () => {
  let component: SupervisionOrderGroupSelectorComponent;
  let fixture: ComponentFixture<SupervisionOrderGroupSelectorComponent>;
  let debugElement: DebugElement;

  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  const supervisionOrderDataService: any = jasmine.createSpyObj('supervisionOrderDataService', {
    create: of(new SupervisionOrder()),
  });

  const selectedOrderType = 'NONE';
  const itemUUID = 'itemUUID1234';

  const selectedGroup = new Group();
  selectedGroup.uuid = 'GroupUUID1234';

  const supervisionDataObject = new SupervisionOrder();
  supervisionDataObject.ordertype = selectedOrderType;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPaginationModule,
        TranslateModule.forRoot(),
        SupervisionOrderGroupSelectorComponent,
      ],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
        { provide: NotificationsService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SupervisionOrderGroupSelectorComponent, {
        remove: { imports: [EpersonGroupListComponent] },
      })
      .compileComponents();

  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SupervisionOrderGroupSelectorComponent);
    component = fixture.componentInstance;

  }));

  beforeEach(() => {
    component.itemUUID = itemUUID;
    component.selectedGroup = selectedGroup;
    component.selectedOrderType = selectedOrderType;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call create for supervision order', () => {
    component.save();
    fixture.detectChanges();
    expect(supervisionOrderDataService.create).toHaveBeenCalledWith(supervisionDataObject, itemUUID, selectedGroup.uuid, selectedOrderType);
  });

});
