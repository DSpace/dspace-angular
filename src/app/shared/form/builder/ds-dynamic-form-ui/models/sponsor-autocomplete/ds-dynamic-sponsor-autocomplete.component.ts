import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { catchError, debounceTime, distinctUntilChanged, map, merge, switchMap, take, tap } from 'rxjs/operators';
import { buildPaginatedList, PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { isEmpty, isNotEmpty } from '../../../../../empty.util';
import { MetadataValueDataService } from '../../../../../../core/data/metadata-value-data.service';
import { MetadataValue } from '../../../../../../core/metadata/metadata-value.model';
import { LookupRelationService } from '../../../../../../core/data/lookup-relation.service';
import { ExternalSource } from '../../../../../../core/shared/external-source.model';
import { ExternalSourceEntry } from '../../../../../../core/shared/external-source-entry.model';
import { PaginatedSearchOptions } from '../../../../../search/models/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { EU_PROJECT_PREFIX, SEPARATOR, SPONSOR_METADATA_NAME } from '../ds-dynamic-complex.model';
import { TranslateService } from '@ngx-translate/core';
import { DsDynamicAutocompleteComponent } from '../autocomplete/ds-dynamic-autocomplete.component';
import { AUTOCOMPLETE_COMPLEX_PREFIX } from '../autocomplete/ds-dynamic-autocomplete.model';
import { DsDynamicAutocompleteService } from '../autocomplete/ds-dynamic-autocomplete.service';
import { DEFAULT_EU_FUNDING_TYPES } from './ds-dynamic-sponsor-autocomplete.model';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';

/**
 * Component representing a sponsor autocomplete input field in the complex input type.
 */
@Component({
  selector: 'ds-dynamic-sponsor-autocomplete',
  styleUrls: ['../tag/dynamic-tag.component.scss'],
  templateUrl: '../autocomplete/ds-dynamic-autocomplete.component.html'
})
export class DsDynamicSponsorAutocompleteComponent extends DsDynamicAutocompleteComponent implements OnInit {

  constructor(protected vocabularyService: VocabularyService,
              protected cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected metadataValueService: MetadataValueDataService,
              protected lookupRelationService: LookupRelationService,
              protected translateService: TranslateService
  ) {
    super(vocabularyService, cdr, layoutService, validationService, metadataValueService,
      lookupRelationService);
  }

  /**
   * From suggestion update model: 1. openAIRE -> compose input from suggestion value,
   *                               2. metadata suggestion -> update as suggestion value.
   * @param updateValue
   */
  updateModel(updateValue) {
    let newValue;
    if (updateValue instanceof  ExternalSourceEntry) {
      // special autocomplete sponsor input
      newValue = this.composeSponsorInput(updateValue);
    } else {
      // VocabularyEntry
      newValue = AUTOCOMPLETE_COMPLEX_PREFIX + SEPARATOR + updateValue.value;
    }
    this.dispatchUpdate(newValue);
  }

  /**
   * Prettify suggestion
   * @param suggestion raw suggestion value
   */
  suggestionFormatter = (suggestion: TemplateRef<any>) => {
    let fundingProjectCode = '';
    let fundingName = '';
    if (suggestion instanceof ExternalSourceEntry) {
      // suggestion from the openAIRE
      fundingProjectCode = this.getProjectCodeFromId(suggestion?.id);
      fundingName = suggestion.metadata?.['dc.title']?.[0]?.value;
    } else if (suggestion instanceof  VocabularyEntry) {
      // the value is in the format: `<FUNDING_TYPE>;<PROJECT_CODE>;<FUND_ORGANIZATION>;<FUNDING_NAME>;`
      const fundingFields = suggestion.value?.split(SEPARATOR);
      fundingProjectCode = fundingFields?.[1];
      fundingName = fundingFields?.[3];
    }
    return DsDynamicAutocompleteService.pretifySuggestion(fundingProjectCode, fundingName, this.translateService);
  };

  /**
   * Converts a text values stream from the `<input>` element to the array stream of the items
   * and display them in the typeahead popup.
   */
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.changeSearchingStatus(true)),
      switchMap((term) => {
        // min 3 characters
        if (term === '' || term.length < this.model.minChars || term.length > this.model.maxLength) {
          return observableOf({ list: [] });
        } else {
        let response: Observable<PaginatedList<ExternalSourceEntry | MetadataValue>>;
          // if openAIRE
          if (this.isEUSponsor()) {
            // eu funding
            response = this.lookupRelationService.getExternalResults(
              this.getOpenAireExternalSource(), this.getFundingRequestOptions(term));
          } else {
            // non eu funding
            response = this.metadataValueService.findByMetadataNameAndByValue(SPONSOR_METADATA_NAME, term);
          }
          if (isEmpty(response)) {
            return observableOf({ list: [] });
          }
          return response.pipe(
            tap(() => this.searchFailed = false),
            catchError((error) => {
              this.searchFailed = true;
              return observableOf(buildPaginatedList(
                new PageInfo(),
                []
              ));
            }));
        }
      }),
      map((list: any) => {
        return list.page;
      }),
      tap(() => this.changeSearchingStatus(false)),
      merge(this.hideSearchingWhenUnsubscribed));

  /**
   * Check if in the complex input type is funding type selected as EU.
   */
  isEUSponsor() {
    // @ts-ignore
    const fundingType = this.model.parent?.group?.[0]?.value;
    if (isNotEmpty(fundingType) && DEFAULT_EU_FUNDING_TYPES.includes(fundingType.value)) {
      return true;
    }
    return false;
  }

  /**
   * Only for the local.sponsor complex input type
   * The external funding is composed as one complex input field
   * @param updateValue external funding from the openAIRE
   */
  composeSponsorInput(updateValue) {
    // set prefix to distinguish composed complex input in the complex.model.ts - get method
    let newValue = AUTOCOMPLETE_COMPLEX_PREFIX + SEPARATOR;
    let fundingType = this.loadNoneSponsorFundingType();
    let fundingProjectCode = '';
    let fundingOrganization = updateValue?.metadata?.['project.funder.name']?.[0]?.value;
    let fundingProjectName = updateValue?.value;

    if (updateValue?.id.startsWith(EU_PROJECT_PREFIX)) {
      fundingType = this.loadEUFundingType();
      fundingProjectCode = this.getProjectCodeFromId(updateValue?.id);
    }

    // Remove SEPARATOR character from every part of the sponsor, because then it's throws an error because of
    // wrong separation.
    fundingType = this.replaceSeparatorValue(fundingType, '');
    fundingProjectCode = this.replaceSeparatorValue(fundingProjectCode, '');
    fundingOrganization = this.replaceSeparatorValue(fundingOrganization, '');
    fundingProjectName = this.replaceSeparatorValue(fundingProjectName, '');

    newValue += [fundingType, fundingProjectCode, fundingOrganization, fundingProjectName].join(SEPARATOR);
    if (updateValue?.id.startsWith(EU_PROJECT_PREFIX)) {
      newValue += SEPARATOR + updateValue?.id;
    }

    return newValue;
  }

  /**
   * Load EU sponsor string e.g.`EU` from the `en.json5` messages file.
   * @private
   */
  private loadEUFundingType() {
    let euFundingType = null;
    this.translateService.get('autocomplete.suggestion.sponsor.eu')
      .pipe(take(1))
      .subscribe( ft => {
        euFundingType = ft;
      });
    return euFundingType;
  }

  /**
   * Load None sponsor string e.g.`N/A` from the `en.json5` messages file.
   * @private
   */
  private loadNoneSponsorFundingType() {
    let noneFundingType = null;
    this.translateService.get('autocomplete.suggestion.sponsor.empty')
      .pipe(take(1))
      .subscribe( ft => {
        noneFundingType = ft;
      });
    return noneFundingType;
  }

  /**
   * Only for the local.sponsor complex input type
   * If the project type is EU, the second input field must be in the format `Funder/FundingProgram/ProjectID`
   * but in the response the Funder information is not in the right format. The right format is only in the
   * `id` which is in the format: `info:eu-repo/grantAgreement/Funder/FundingProgram/ProjectID/`.
   * `Funder/FundingProgram/ProjectID` is loaded from the `id` in this method
   * @param id `info:eu-repo/grantAgreement/Funder/FundingProgram/ProjectID/`
   * @return formatedID `Funder/FundingProgram/ProjectID/`
   */
  getProjectCodeFromId(id) {
    const regex = '^info:eu-repo\\/grantAgreement\\/(.*)$';
    const updatedId = id.match(regex);

    // updated value is in the updatedId[1]
    return isNotEmpty(updatedId?.[1]) ? updatedId?.[1] : id;
  }

  /**
   * Only for the local.sponsor complex input type
   * Request must contain externalSource definition.
   * @return externalSource openAIREFunding
   */
  getOpenAireExternalSource() {
    const externalSource = Object.assign(new ExternalSource(), {
      id: 'openAIREFunding',
      name: 'openAIREFunding',
      hierarchical: false
    });
    return externalSource;
  }

  /**
   * Only for the local.sponsor complex input type
   * Just pagination options
   * @param term searching value for funding
   */
  getFundingRequestOptions(term) {
    let options: PaginatedSearchOptions;
    const pageOptions = Object.assign(new PaginationComponentOptions(), { pageSize: 20, page: 1 });
    options = new PaginatedSearchOptions({
      pagination: pageOptions,
      query: term,
    });
    return options;
  }

  /**
   * Remove SEPARATOR character from every part of the sponsor, because then it's throws an error because of
   * wrong separation.
   */
  private replaceSeparatorValue(value, replacement) {
    return value.replace(SEPARATOR, replacement);
  }
}
