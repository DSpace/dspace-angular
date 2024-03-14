import { RequestParam } from '../cache/models/request-param.model';
import { FindListOptions } from '../data/find-list-options.model';
import { SubmissionDuplicateDataService } from './submission-duplicate-data.service';

/**
 * Basic tests for the submission-duplicate-data.service.ts service
 */
describe('SubmissionDuplicateDataService', () => {
  const duplicateDataService = new SubmissionDuplicateDataService(null, null, null, null);

  // Test the findDuplicates method to make sure that a call results in an expected
  // call to searchBy, using the 'findByItem' search method
  describe('findDuplicates', () => {
    beforeEach(() => {
      spyOn(duplicateDataService, 'searchBy');
    });

    it('should call searchBy with the correct arguments', () => {
      // Set up expected search parameters and find options
      const searchParams = [];
      searchParams.push(new RequestParam('uuid', 'test'));
      let findListOptions = new FindListOptions();
      findListOptions.searchParams = searchParams;
      // Perform test search using uuid 'test' using the findDuplicates method
      const result = duplicateDataService.findDuplicates('test', new FindListOptions(), true, true);
      // Expect searchBy('findByItem'...) to have been used as SearchData impl with the expected options (uuid=test)
      expect(duplicateDataService.searchBy).toHaveBeenCalledWith('findByItem', findListOptions, true, true);
    });
  });
});
