/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';

import { RequestParam } from '../../cache/models/request-param.model';
import { testFindAllDataImplementation } from '../../data/base/find-all-data.spec';
import { FindListOptions } from '../../data/find-list-options.model';
import { VocabularyDataService } from './vocabulary.data.service';

describe('VocabularyDataService', () => {
  let service: VocabularyDataService;
  service = initTestService();
  let restEndpointURL = 'https://rest.api/server/api/submission/vocabularies';
  let vocabularyByMetadataAndCollectionEndpoint = `${restEndpointURL}/search/byMetadataAndCollection?metadata=dc.contributor.author&collection=1234-1234`;

  function initTestService() {
    return new VocabularyDataService(null, null, null, null);
  }

  describe('composition', () => {
    const initService = () => new VocabularyDataService(null, null, null, null);
    testFindAllDataImplementation(initService);
  });

  describe('getVocabularyByMetadataAndCollection', () => {
    it('search vocabulary by metadata and collection calls expected methods', () => {
      spyOn((service as any).searchData, 'getSearchByHref').and.returnValue(vocabularyByMetadataAndCollectionEndpoint);
      spyOn(service, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(null));
      service.getVocabularyByMetadataAndCollection('dc.contributor.author', '1234-1234');
      const options = Object.assign(new FindListOptions(), {
        searchParams: [Object.assign(new RequestParam('metadata', 'dc.contributor.author')),
          Object.assign(new RequestParam('collection', '1234-1234'))],
      });
      expect((service as any).searchData.getSearchByHref).toHaveBeenCalledWith('byMetadataAndCollection', options);
      expect(service.findByHref).toHaveBeenCalledWith(vocabularyByMetadataAndCollectionEndpoint, true, true);
    });
  });
});
