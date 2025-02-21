import { testCreateDataImplementation } from './base';
import { testFindAllDataImplementation } from './base';
import { testPutDataImplementation } from './base';
import { SystemWideAlertDataService } from './system-wide-alert-data.service';

describe('SystemWideAlertDataService', () => {
  describe('composition', () => {
    const initService = () => new SystemWideAlertDataService(null, null, null, null, null);
    testFindAllDataImplementation(initService);
    testPutDataImplementation(initService);
    testCreateDataImplementation(initService);
  });
});
