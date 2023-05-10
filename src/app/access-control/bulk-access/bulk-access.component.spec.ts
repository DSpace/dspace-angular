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

fdescribe('BulkAccessComponent', () => {
  let component: BulkAccessComponent;
  let fixture: ComponentFixture<BulkAccessComponent>;
  let bulkAccessControlService: any;
  let selectableListService: any;

  const selectableListServiceMock = jasmine.createSpyObj('SelectableListService', ['getSelectableList', 'deselectAll']);
  const bulkAccessControlServiceMock = jasmine.createSpyObj('bulkAccessControlService', ['createPayloadFile', 'executeScript']);

  const mockFormState = {
    "bitstream": [],
    "item": [
      {
        "name": "embargo",
        "startDate": {
          "year": 2026,
          "month": 5,
          "day": 31
        },
        "endDate": null
      }
    ],
    "state": {
      "item": {
        "toggleStatus": true,
        "accessMode": "replace"
      },
      "bitstream": {
        "toggleStatus": false,
        "accessMode": "",
        "changesLimit": "",
        "selectedBitstreams": []
      }
    }
  };

  const mockSettings: any = jasmine.createSpyObj('AccessControlFormContainerComponent',  {
    getValue: jasmine.createSpy('getValue'),
    reset: jasmine.createSpy('reset')
  });
  const selection: any[] = [{ indexableObject: { uuid: '1234' } }, { indexableObject: { uuid: '5678' } }];
  const selectableListState: SelectableListState = { id: 'test', selection };
  const expectedIdList = ['1234', '5678'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ],
      declarations: [ BulkAccessComponent ],
      providers: [
        { provide: BulkAccessControlService, useValue: bulkAccessControlServiceMock },
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
    (component as any).selectableListService.getSelectableList.and.returnValue(of(selectableListState));
    fixture.detectChanges();
    component.settings = mockSettings;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the id list by selected elements', () => {
    expect(component.objectsSelected$.value).toEqual(expectedIdList);
  });

  it('should disable the execute button when there are no objects selected', () => {
    expect(component.canExport()).toBe(false);
  });

  it('should enable the execute button when there are objects selected', () => {
    component.objectsSelected$.next(['1234']);
    expect(component.canExport()).toBe(true);
  });

  it('should call the settings reset method when reset is called', () => {
    spyOn(component.settings, 'reset');
    component.reset();
    expect(component.settings.reset).toHaveBeenCalled();
  });

  it('should call the bulkAccessControlService executeScript method when submit is called', () => {
    (component.settings as any).getValue.and.returnValue(mockFormState)
    bulkAccessControlService.executeScript.and.returnValue(createSuccessfulRemoteDataObject$(new Process()));
    component.objectsSelected$.next(['1234']);
    component.submit();
    expect(bulkAccessControlService.executeScript).toHaveBeenCalled();
  });
});
