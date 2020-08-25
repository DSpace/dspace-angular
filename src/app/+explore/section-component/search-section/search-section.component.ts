import { Component, OnInit, Input } from '@angular/core';
import { SearchSection } from 'src/app/core/layout/models/section.model';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { map, tap } from 'rxjs/operators';

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
                private searchService: SearchService) {

    }

    ngOnInit() {

        this.filters = this.searchService.getSearchConfigurationFor(null, this.searchSection.discoveryConfigurationName)
            .pipe(
                getFirstSucceededRemoteDataPayload(),
                map((searchConfig) => [this.allFilter].concat( searchConfig.filters.map((filterConfig) => filterConfig.filter)))
            );

        this.searchForm = this.formBuilder.group(({
            queryArray: this.formBuilder.array([])
        }));

        this.addQueryStatement();
        this.addQueryStatement();
        this.addQueryStatement();
    }

    onSubmit(data: {queryArray: QueryStatement[]}) {
        const query = this.composeQuery(data.queryArray);
        const configurationName = this.searchSection.discoveryConfigurationName;
        this.router.navigate([this.searchService.getSearchLink()], { queryParams: { page: 1, configuration: configurationName, query: query }});
    }

    onReset() {
        this.queryArray.controls.splice(0,this.queryArray.controls.length);
        this.addQueryStatement();
        this.addQueryStatement();
        this.addQueryStatement();
    }

    createFormGroup(): FormGroup {
        return this.formBuilder.group({
            filter: this.allFilter,
            query: '',
            operation: this.operations[0]
        });
    }

    get queryArray(): FormArray {
        return this.searchForm.get('queryArray') as FormArray;
    };

    addQueryStatement(): void {
        this.queryArray.push(this.createFormGroup());
    }

    /**
     * Compose the search query starting from the user input.
     *
     * @param statements the query statements entered by the user
     */
    composeQuery( statements: QueryStatement[] ): string {
        let query = '';

        for (const statement of statements) {
            if ( statement.query !== '' ) {
                const filter = statement.filter !== this.allFilter ? statement.filter + ':' : '';
                query = query + ' ' + filter + '(' + statement.query + ') ' + statement.operation;
            }
        }

        // Remove last operation
        const lastOperationIndex = query.lastIndexOf(' ');
        return query.substring(0, lastOperationIndex);
    }
}

interface QueryStatement {
    filter: string;
    query: string;
    operation: string;
}
