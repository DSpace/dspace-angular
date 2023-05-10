import { TestBed } from '@angular/core/testing';
import { BulkAccessControlService, BulkAccessPayload } from './bulk-access-control.service';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';

describe('BulkAccessControlService', () => {
  let service: BulkAccessControlService;
  let scriptServiceSpy: jasmine.SpyObj<ScriptDataService>;



  beforeEach(() => {
    const spy = jasmine.createSpyObj('ScriptDataService', ['invoke']);
    TestBed.configureTestingModule({
      providers: [
        BulkAccessControlService,
        { provide: ScriptDataService, useValue: spy }
      ]
    });
    service = TestBed.inject(BulkAccessControlService);
    scriptServiceSpy = TestBed.inject(ScriptDataService) as jasmine.SpyObj<ScriptDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createPayloadFile', () => {
    it('should create a file and return the URL and file object', () => {
      const payload: BulkAccessPayload = { state: null, bitstreamAccess: null, itemAccess: null };
      const result = service.createPayloadFile(payload);

      expect(result.url).toBeTruthy();
      expect(result.file).toBeTruthy();
    });
  });

  describe('executeScript', () => {
    it('should invoke the script service with the correct parameters', () => {
      const uuids = ['123', '456'];
      const file = new File(['test'], 'data.json', { type: 'application/json' });
      const expectedParams: ProcessParameter[] = [{ name: 'uuid', value: '123,456' }];

      // @ts-ignore
      scriptServiceSpy.invoke.and.returnValue(Promise.resolve({}));

      const result = service.executeScript(uuids, file);

      expect(scriptServiceSpy.invoke).toHaveBeenCalledWith('bulk-access-control', expectedParams, [file]);
      expect(result).toBeTruthy();
    });
  });
});
