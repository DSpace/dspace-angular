import {
  KeyValuePipe,
  NgForOf,
} from '@angular/common';
import {
  Component,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  NgbAccordion,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { RestRequestMethod } from 'src/app/core/data/rest-request-method';
import { DspaceRestService } from 'src/app/core/dspace-rest/dspace-rest.service';
import { RawRestResponse } from 'src/app/core/dspace-rest/raw-rest-response.model';
import { environment } from 'src/environments/environment';

import { FiltersComponent } from '../filters-section/filters-section.component';
import { FilteredCollections } from './filtered-collections.model';

/**
 * Component representing the Filtered Collections content report
 */
@Component({
  selector: 'ds-report-filtered-collections',
  templateUrl: './filtered-collections.component.html',
  styleUrls: ['./filtered-collections.component.scss'],
  imports: [
    TranslateModule,
    NgbAccordionModule,
    FiltersComponent,
    KeyValuePipe,
    NgForOf,
  ],
  standalone: true,
})
export class FilteredCollectionsComponent {

  queryForm: FormGroup;
  results: FilteredCollections = new FilteredCollections();
  @ViewChild('acc') accordionComponent: NgbAccordion;

  constructor(
    private formBuilder: FormBuilder,
    private restService: DspaceRestService) {}

  ngOnInit() {
    this.queryForm = this.formBuilder.group({
      filters: FiltersComponent.formGroup(this.formBuilder),
    });
  }

  filtersFormGroup(): FormGroup {
    return this.queryForm.get('filters') as FormGroup;
  }

  getGroup(filterId: string): string {
    return FiltersComponent.getGroup(filterId).id;
  }

  submit() {
    this
      .getFilteredCollections()
      .subscribe(
        response => {
          this.results.deserialize(response.payload);
          this.accordionComponent.expand('collections');
        },
      );
  }

  getFilteredCollections(): Observable<RawRestResponse> {
    let params = this.toQueryString();
    if (params.length > 0) {
      params = `?${params}`;
    }
    const scheme = environment.rest.ssl ? 'https' : 'http';
    const urlRestApp = `${scheme}://${environment.rest.host}:${environment.rest.port}${environment.rest.nameSpace}`;
    return this.restService.request(RestRequestMethod.GET, `${urlRestApp}/api/contentreport/filteredcollections${params}`);
  }

  private toQueryString(): string {
    const params = FiltersComponent.toQueryString(this.queryForm.value.filters);
    return params;
  }

}
