import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { Process } from '../../process-page/processes/process.model';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { NotificationsService } from '../notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { NotificationsServiceStub } from '../testing/notifications-service.stub';
import { BulkAccessControlService } from './bulk-access-control.service';

describe('BulkAccessControlService', () => {
  let service: BulkAccessControlService;
  let scriptServiceSpy: jasmine.SpyObj<ScriptDataService>;

  const mockPayload: any = {
    'bitstream': [],
    'item': [
      {
        'name': 'embargo',
        'startDate': {
          'year': 2026,
          'month': 5,
          'day': 31,
        },
        'endDate': null,
      },
    ],
    'state': {
      'item': {
        'toggleStatus': true,
        'accessMode': 'replace',
      },
      'bitstream': {
        'toggleStatus': false,
        'accessMode': '',
        'changesLimit': '',
        'selectedBitstreams': [],
      },
    },
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ScriptDataService', ['invoke']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        BulkAccessControlService,
        { provide: ScriptDataService, useValue: spy },
        { provide: NotificationsService, useValue: NotificationsServiceStub },
      ],
    });
    service = TestBed.inject(BulkAccessControlService);
    scriptServiceSpy = TestBed.inject(ScriptDataService) as jasmine.SpyObj<ScriptDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createPayloadFile', () => {
    it('should create a file and return the URL and file object', () => {
      const payload = mockPayload;
      const result = service.createPayloadFile(payload);

      expect(result.url).toBeTruthy();
      expect(result.file).toBeTruthy();
    });
  });

  describe('executeScript', () => {
    it('should invoke the script service with the correct parameters', () => {
      const uuids = ['123', '456'];
      const file = new File(['test'], 'data.json', { type: 'application/json' });
      const expectedParams: ProcessParameter[] = [
        { name: '-f', value: 'data.json' },
        { name: '-u', value: '123' },
        { name: '-u', value: '456' },
      ];

      // @ts-ignore
      scriptServiceSpy.invoke.and.returnValue(createSuccessfulRemoteDataObject$(new Process()));

      const result = service.executeScript(uuids, file);

      expect(scriptServiceSpy.invoke).toHaveBeenCalledWith('bulk-access-control', expectedParams, [file]);
      expect(result).toBeTruthy();
    });
  });
});
