/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { of } from 'rxjs';

import { ProcessParameter } from '../../processes/process-parameter.model';
import { testFindAllDataImplementation } from '../base/find-all-data.spec';
import { PostRequest } from '../request.models';
import { ScriptDataService } from './script-data.service';

describe('ScriptDataService', () => {
  describe('composition', () => {
    const initService = () => new ScriptDataService(null, null, null, null);
    testFindAllDataImplementation(initService);
  });

  describe('invokeWithUploads', () => {
    it('posts the parameters and upload identifiers as JSON to the script processes endpoint', () => {
      const requestService = jasmine.createSpyObj('requestService', { generateRequestId: 'request-id', send: undefined });
      const rdbService = jasmine.createSpyObj('rdbService', { buildFromRequestUUID: of(undefined) });
      const halService = jasmine.createSpyObj('halService', { getEndpoint: of('https://rest.api/api/system/scripts') });
      const service = new ScriptDataService(requestService, rdbService, null, halService);
      const parameters = [Object.assign(new ProcessParameter(), { name: '--zip', value: 'batch.zip' })];

      service.invokeWithUploads('import', parameters, ['upload-id']);

      const request: PostRequest = requestService.send.calls.mostRecent().args[0];
      expect(request).toBeInstanceOf(PostRequest);
      expect(request.href).toBe('https://rest.api/api/system/scripts/import/processes');
      expect(request.options.headers.get('Content-Type')).toBe('application/json');
      expect(JSON.parse(request.body)).toEqual({ properties: [{ name: '--zip', value: 'batch.zip' }], uploads: ['upload-id'] });
      expect(rdbService.buildFromRequestUUID).toHaveBeenCalledWith('request-id');
    });
  });
});
