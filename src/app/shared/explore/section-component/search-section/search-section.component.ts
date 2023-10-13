import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchSection } from '../../../../core/layout/models/section.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchConfig } from '../../../search/search-filters/search-config.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

/**
 * Component representing the Search component section.
 */
@Component({
  selector: 'ds-search-section',
  templateUrl: './search-section.component.html'
})
export class SearchSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  searchSection: SearchSection;

  // The search form
  searchForm: FormGroup;

  filters: Observable<string[]>;

  allFilter = 'all';

  operations = ['AND', 'OR', 'NOT'];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private searchService: SearchService,
              private searchConfigurationService: SearchConfigurationService,
  ) {

  }

  get queryArray(): FormArray {
    return this.searchForm.get('queryArray') as FormArray;
  }

  ngOnInit() {

    this.filters = this.searchConfigurationService.getSearchConfigurationFor(null, this.searchSection.discoveryConfigurationName).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((searchFilterConfig: SearchConfig) => {
        return [this.allFilter].concat(searchFilterConfig.filters
          .filter((filterConfig) => !filterConfig.filter.startsWith('graph'))
          .map((filterConfig) => filterConfig.filter));
      })
    );

    this.searchForm = this.formBuilder.group(({
      queryArray: this.formBuilder.array([])
    }));

    const statements = this.searchSection.initialStatements ? this.searchSection.initialStatements : 3;
    for (let i = 0; i < statements; i++) {
      this.addQueryStatement();
    }
  }

  /**
   * Navigate to the search page with the composed query.
   * @param data the query statements
   */
  onSubmit(data: { queryArray: QueryStatement[] }) {
    const query = this.composeQuery(data.queryArray);
    const configurationName = this.searchSection.discoveryConfigurationName;
    this.router.navigate([this.searchService.getSearchLink()], {
      queryParams: {
        page: 1,
        configuration: configurationName,
        query: query
      }
    });
  }

  /**
   * Reset the form.
   */
  onReset() {
    this.queryArray.controls.splice(0, this.queryArray.controls.length);
    const statements = this.searchSection.initialStatements ? this.searchSection.initialStatements : 3;
    for (let i = 0; i < statements; i++) {
      this.addQueryStatement();
    }
  }

  /**
   * Initialize the form group.
   */
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      filter: this.allFilter,
      query: '',
      operation: this.operations[0]
    });
  }

  addQueryStatement(): void {
    this.queryArray.push(this.createFormGroup());
  }

  /**
   * Compose the search query starting from the user input.
   *
   * @param statements the query statements entered by the user
   */
  composeQuery(statements: QueryStatement[]): string {
    let query = '';

    for (const statement of statements) {
      if (statement.query !== '') {
        const statementFilter = statement.filter !== this.allFilter ? statement.filter + ':' : '';
        query = query + ' ' + statementFilter + '(' + statement.query + ') ' + statement.operation;
      }
    }

    // Remove last operation
    const lastOperationIndex = query.lastIndexOf(' ');
    return query.substring(0, lastOperationIndex).trim();
  }
}

/**
 * Interface related to the form model.
 */
interface QueryStatement {
  filter: string;
  query: string;
  operation: string;
}
