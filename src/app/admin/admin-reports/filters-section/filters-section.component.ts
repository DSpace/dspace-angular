import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterGroup } from './filter-group.model';
import { Filter } from './filter.model';

/**
 * Component representing the Query Filters section used in both
 * Filtered Collections and Filtered Items content reports
 */
@Component({
  selector: 'ds-filters',
  templateUrl: './filters-section.component.html',
  styleUrls: ['./filters-section.component.scss']
})
export class FiltersComponent {

  static FILTERS = [
    new FilterGroup('property', [
      new Filter('is_item'),
      new Filter('is_withdrawn'),
      new Filter('is_not_withdrawn'),
      new Filter('is_discoverable'),
      new Filter('is_not_discoverable')
    ]),
    new FilterGroup('bitstream', [
      new Filter('has_multiple_originals'),
      new Filter('has_no_originals'),
      new Filter('has_one_original')
    ]),
    new FilterGroup('bitstream_mime', [
      new Filter('has_doc_original'),
      new Filter('has_image_original'),
      new Filter('has_unsupp_type'),
      new Filter('has_mixed_original'),
      new Filter('has_pdf_original'),
      new Filter('has_jpg_original'),
      new Filter('has_small_pdf'),
      new Filter('has_large_pdf'),
      new Filter('has_doc_without_text')
    ]),
    new FilterGroup('mime', [
      new Filter('has_only_supp_image_type'),
      new Filter('has_unsupp_image_type'),
      new Filter('has_only_supp_doc_type'),
      new Filter('has_unsupp_doc_type')
    ]),
    new FilterGroup('bundle', [
      new Filter('has_unsupported_bundle'),
      new Filter('has_small_thumbnail'),
      new Filter('has_original_without_thumbnail'),
      new Filter('has_invalid_thumbnail_name'),
      new Filter('has_non_generated_thumb'),
      new Filter('no_license'),
      new Filter('has_license_documentation')
    ]),
    new FilterGroup('permission', [
      new Filter('has_restricted_original', true),
      new Filter('has_restricted_thumbnail', true),
      new Filter('has_restricted_metadata', true)
    ])
  ];

  @Input() filtersForm: FormGroup;

  static formGroup(formBuilder: FormBuilder): FormGroup {
    let fields = {};
    let allFilters = FiltersComponent.FILTERS;
    for (let i = 0; i < allFilters.length; i++) {
      let group = allFilters[i];
      for (let j = 0; j < group.filters.length; j++) {
        let filter = group.filters[j];
        fields[filter.id] = new FormControl(false);
      }
    }
    return formBuilder.group(fields);
  }

  static getFilter(filterId: string): Filter {
    let allFilters = FiltersComponent.FILTERS;
    for (let i = 0; i < allFilters.length; i++) {
      let group = allFilters[i];
      for (let j = 0; j < group.filters.length; j++) {
        let filter = group.filters[j];
        if (filter.id === filterId) {
          return filter;
        }
      }
    }
    return undefined;
  }

  static getGroup(filterId: string): FilterGroup {
    let allFilters = FiltersComponent.FILTERS;
    for (let i = 0; i < allFilters.length; i++) {
      let group = allFilters[i];
      for (let j = 0; j < group.filters.length; j++) {
        let filter = group.filters[j];
        if (filter.id === filterId) {
          return group;
        }
      }
    }
    return undefined;
  }

  static toQueryString(filters: Object): string {
    let params = '';
    let first = true;
    for (const key in filters) {
      if (filters[key]) {
        if (first) {
          first = false;
        } else {
          params += '&';
        }
        params += `filters=${key}`;
      }
    }
    return params;
  }

  allFilters(): FilterGroup[] {
    return FiltersComponent.FILTERS;
  }

  private setAllFilters(value: boolean) {
    // I don't know why, but patchValue() with individual controls doesn't work.
    // I therefore use setValue() with the whole set, which mercifully works...
    let fields = {};
    let allFilters = FiltersComponent.FILTERS;
    for (let i = 0; i < allFilters.length; i++) {
      let group = allFilters[i];
      for (let j = 0; j < group.filters.length; j++) {
        let filter = group.filters[j];
        fields[filter.id] = value;
      }
    }
    this.filtersForm.setValue(fields);
  }

  selectAll(): void {
    this.setAllFilters(true);
  }

  deselectAll(): void {
    this.setAllFilters(false);
  }

}
