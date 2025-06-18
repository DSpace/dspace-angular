import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { of } from 'rxjs';

import { BulkAccessConfigDataService } from '../../core/config/bulk-access-config-data.service';
import { Item } from '../../core/shared/item.model';
import { SelectableListService } from '../object-list/selectable-list/selectable-list.service';
import { AccessControlFormContainerComponent } from './access-control-form-container.component';
import { createAccessControlInitialFormState } from './access-control-form-container-intial-state';
import { BulkAccessControlService } from './bulk-access-control.service';
import { ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID } from './item-access-control-select-bitstreams-modal/item-access-control-select-bitstreams-modal.component';

describe('AccessControlFormContainerComponent', () => {
  let component: AccessControlFormContainerComponent<any>;
  let fixture: ComponentFixture<AccessControlFormContainerComponent<any>>;


  // Mock NgbModal
  @Component({
    selector: 'ds-ngb-modal', template: '',
    standalone: true,
    imports: [
      FormsModule,
      NgbDatepickerModule,
      UiSwitchModule,
    ],
  })
  class MockNgbModalComponent {
  }

  // Mock dependencies
  const mockBulkAccessControlService = {
    createPayloadFile: jasmine.createSpy('createPayloadFile').and.returnValue({ file: 'mocked-file' }),
    executeScript: jasmine.createSpy('executeScript').and.returnValue(of('success')),
  };

  const mockBulkAccessConfigDataService = {
    findByName: jasmine.createSpy('findByName').and.returnValue(of({ payload: { options: [] } })),
  };

  const mockSelectableListService = {
    getSelectableList: jasmine.createSpy('getSelectableList').and.returnValue(of({ selection: [] })),
    deselectAll: jasmine.createSpy('deselectAll'),
  };

  const mockNgbModal = {
    open: jasmine.createSpy('open').and.returnValue(
      { componentInstance: {}, closed: of({}) } as NgbModalRef,
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forRoot(),
        NgbDatepickerModule,
        UiSwitchModule,
        AccessControlFormContainerComponent, MockNgbModalComponent,
      ],
      providers: [
        { provide: BulkAccessControlService, useValue: mockBulkAccessControlService },
        { provide: BulkAccessConfigDataService, useValue: mockBulkAccessConfigDataService },
        { provide: SelectableListService, useValue: mockSelectableListService },
        { provide: NgbModal, useValue: mockNgbModal },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlFormContainerComponent);
    component = fixture.componentInstance;
    component.state = createAccessControlInitialFormState();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form', fakeAsync(() => {
    fixture.detectChanges();
    const resetSpy = spyOn(component.bitstreamAccessCmp, 'reset');
    spyOn(component.itemAccessCmp, 'reset');

    component.reset();

    expect(resetSpy).toHaveBeenCalled();
    expect(component.itemAccessCmp.reset).toHaveBeenCalled();
    expect(component.state).toEqual(createAccessControlInitialFormState());
  }));

  it('should submit the form', () => {
    const bitstreamAccess = 'bitstreamAccess';
    const itemAccess = 'itemAccess';
    component.bitstreamAccessCmp.getValue = jasmine.createSpy('getValue').and.returnValue(bitstreamAccess);
    component.itemAccessCmp.getValue = jasmine.createSpy('getValue').and.returnValue(itemAccess);
    component.itemRD = { payload: { uuid: 'item-uuid' } } as any;

    component.submit();

    expect(mockBulkAccessControlService.createPayloadFile).toHaveBeenCalledWith({
      bitstreamAccess,
      itemAccess,
      state: createAccessControlInitialFormState(),
    });
    expect(mockBulkAccessControlService.executeScript).toHaveBeenCalledWith(['item-uuid'], 'mocked-file');
  });

  it('should handle the status change for bitstream access', () => {
    component.bitstreamAccessCmp.enable = jasmine.createSpy('enable');
    component.bitstreamAccessCmp.disable = jasmine.createSpy('disable');

    component.handleStatusChange('bitstream', true);
    expect(component.bitstreamAccessCmp.enable).toHaveBeenCalled();

    component.handleStatusChange('bitstream', false);
    expect(component.bitstreamAccessCmp.disable).toHaveBeenCalled();
  });

  it('should handle the status change for item access', () => {
    component.itemAccessCmp.enable = jasmine.createSpy('enable');
    component.itemAccessCmp.disable = jasmine.createSpy('disable');

    component.handleStatusChange('item', true);
    expect(component.itemAccessCmp.enable).toHaveBeenCalled();

    component.handleStatusChange('item', false);
    expect(component.itemAccessCmp.disable).toHaveBeenCalled();
  });

  it('should open the select bitstreams modal', () => {
    const modalService = TestBed.inject(NgbModal);

    component.openSelectBitstreamsModal(new Item());
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should unsubscribe and deselect all on component destroy', () => {
    component.ngOnDestroy();
    expect(component.selectableListService.deselectAll).toHaveBeenCalledWith(
      ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID,
    );
  });
});
