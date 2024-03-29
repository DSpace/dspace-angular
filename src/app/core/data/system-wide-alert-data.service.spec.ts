import { testCreateDataImplementation } from './base/create-data.spec';
import { testFindAllDataImplementation } from './base/find-all-data.spec';
import { testPutDataImplementation } from './base/put-data.spec';
import { SystemWideAlertDataService } from './system-wide-alert-data.service';

describe('SystemWideAlertDataService', () => {
  describe('composition', () => {
    const initService = () => new SystemWideAlertDataService(null, null, null, null, null);
    testFindAllDataImplementation(initService);
    testPutDataImplementation(initService);
    testCreateDataImplementation(initService);
  });
});
