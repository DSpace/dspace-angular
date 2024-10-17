import { take } from 'rxjs/operators';
import {isEmpty } from '../../../../../empty.util';
import {TranslateService} from '@ngx-translate/core';

/**
 * Util methods for the DsAutocompleteComponent.
 */
export class DsDynamicAutocompleteService {

  static prettifySponsorSuggestion(fundingProjectCode, fundingName, translateService) {
    if (isEmpty(fundingProjectCode) || isEmpty(fundingName)) {
      throw (new Error('The suggestion returns wrong data!'));
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

  static pretifyLanguageSuggestion(suggestion, translateService: TranslateService) {
    // fetch ISO message
    const isoMessage = translateService.instant('autocomplete.suggestion.language.iso');
    // fetch language message
    const languageMessage = translateService.instant('autocomplete.suggestion.language.title');

    return (isoMessage + ': ').bold() + suggestion?.value + '<br>' + (languageMessage + ': ').bold() +
      suggestion?.display;
  }
}
