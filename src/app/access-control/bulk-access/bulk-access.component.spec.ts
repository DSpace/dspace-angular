import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { BulkAccessComponent } from './bulk-access.component';
import { BulkAccessControlService } from '../../shared/access-control-form-container/bulk-access-control.service';
import { SelectableListService } from '../../shared/object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../shared/object-list/selectable-list/selectable-list.reducer';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Process } from '../../process-page/processes/process.model';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';

describe('BulkAccessComponent', () => {
  let component: BulkAccessComponent;
  let fixture: ComponentFixture<BulkAccessComponent>;
  let bulkAccessControlService: any;
  let selectableListService: any;

  const selectableListServiceMock = jasmine.createSpyObj('SelectableListService', ['getSelectableList', 'deselectAll']);
  const bulkAccessControlServiceMock = jasmine.createSpyObj('bulkAccessControlService', ['createPayloadFile', 'executeScript']);

  const mockFormState = {
    'bitstream': [],
    'item': [
      {
        'name': 'embargo',
        'startDate': {
          'year': 2026,
          'month': 5,
          'day': 31
        },
        'endDate': null
      }
    ],
    'state': {
      'item': {
        'toggleStatus': true,
        'accessMode': 'replace'
      },
      'bitstream': {
        'toggleStatus': false,
        'accessMode': '',
        'changesLimit': '',
        'selectedBitstreams': []
      }
    }
  };

  const mockFile = {
    'uuids': [
      '1234', '5678'
    ],
    'file': {  }
  };

  const mockSettings: any = jasmine.createSpyObj('AccessControlFormContainerComponent',  {
    getValue: jasmine.createSpy('getValue'),
    reset: jasmine.createSpy('reset')
  });
  const selection: any[] = [{ indexableObject: { uuid: '1234' } }, { indexableObject: { uuid: '5678' } }];
  const selectableListState: SelectableListState = { id: 'test', selection };
  const expectedIdList = ['1234', '5678'];

  const selectableListStateEmpty: SelectableListState = { id: 'test', selection: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ BulkAccessComponent ],
      providers: [
        { provide: BulkAccessControlService, useValue: bulkAccessControlServiceMock },
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SelectableListService, useValue: selectableListServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAccessComponent);
    component = fixture.componentInstance;
    bulkAccessControlService = TestBed.inject(BulkAccessControlService);
    selectableListService = TestBed.inject(SelectableListService);

  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('when there are no elements selected', () => {

    beforeEach(() => {

      (component as any).selectableListService.getSelectableList.and.returnValue(of(selectableListStateEmpty));
      fixture.detectChanges();
      component.settings = mockSettings;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should generate the id list by selected elements', () => {
      expect(component.objectsSelected$.value).toEqual([]);
    });

    it('should disable the execute button when there are no objects selected', () => {
      expect(component.canExport()).toBe(false);
    });

  });

  describe('when there are elements selected', () => {

    beforeEach(() => {

      (component as any).selectableListService.getSelectableList.and.returnValue(of(selectableListState));
      fixture.detectChanges();
      component.settings = mockSettings;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should generate the id list by selected elements', () => {
      expect(component.objectsSelected$.value).toEqual(expectedIdList);
    });

    it('should enable the execute button when there are objects selected', () => {
      component.objectsSelected$.next(['1234']);
      expect(component.canExport()).toBe(true);
    });

    it('should call the settings reset method when reset is called', () => {
      component.reset();
      expect(component.settings.reset).toHaveBeenCalled();
    });

    it('should call the bulkAccessControlService executeScript method when submit is called', () => {
      (component.settings as any).getValue.and.returnValue(mockFormState);
      bulkAccessControlService.createPayloadFile.and.returnValue(mockFile);
      bulkAccessControlService.executeScript.and.returnValue(createSuccessfulRemoteDataObject$(new Process()));
      component.objectsSelected$.next(['1234']);
      component.submit();
      expect(bulkAccessControlService.executeScript).toHaveBeenCalled();
    });
  });
});
