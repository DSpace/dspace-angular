/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { testFindAllDataImplementation } from './base';
import { testSearchDataImplementation } from './base';
import { EntityTypeDataService } from '@dspace/core';

describe('EntityTypeDataService', () => {
  describe('composition', () => {
    const initService = () => new EntityTypeDataService(null, null, null, null, null);
    testFindAllDataImplementation(initService);
    testSearchDataImplementation(initService);
  });
});
