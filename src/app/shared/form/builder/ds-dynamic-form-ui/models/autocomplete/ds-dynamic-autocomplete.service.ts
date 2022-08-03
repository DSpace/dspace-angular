import { AUTOCOMPLETE_COMPLEX_PREFIX } from './ds-dynamic-autocomplete.model';
import { SEPARATOR } from '../ds-dynamic-complex.model';
import { take } from 'rxjs/operators';

/**
 * Util methods for the DsAutocompleteComponent.
 */
export class DsDynamicAutocompleteService {
  static removeAutocompletePrefix(formValue) {
    return formValue.value.replace(AUTOCOMPLETE_COMPLEX_PREFIX + SEPARATOR, '');
  }

  static pretifySuggestion(fundingProjectCode, fundingName, translateService) {
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
