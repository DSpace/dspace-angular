import { take } from 'rxjs/operators';
import {isEmpty, isNotEmpty} from '../../../../../empty.util';

/**
 * Util methods for the DsAutocompleteComponent.
 */
export class DsDynamicAutocompleteService {

  static pretifySuggestion(fundingProjectCode, fundingName, translateService) {
    if (isEmpty(fundingProjectCode) || isEmpty(fundingName)) {
      throw(new Error('The suggestion returns wrong data!'));
    }

    // create variable with default values - they will be overridden
    let fundingCode = 'Funding code';
    let projectName = 'Project name';

    // fetch funding code message
    translateService.get('autocomplete.suggestion.sponsor.funding-code')
      .pipe(take(1))
      .subscribe( fc => { fundingCode = fc; });
    // fetch project name message
    translateService.get('autocomplete.suggestion.sponsor.project-name')
      .pipe(take(1))
      .subscribe( pn => { projectName = pn; });

    return (fundingCode + ': ').bold() + fundingProjectCode + '<br>' + (projectName + ': ').bold() + fundingName;
  }
}
