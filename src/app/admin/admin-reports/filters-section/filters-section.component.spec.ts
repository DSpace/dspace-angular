import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';

import { FiltersComponent } from './filters-section.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let formBuilder: FormBuilder;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        FiltersComponent,
      ],
      providers: [
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(waitForAsync(() => {
    formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    component.filtersForm = FiltersComponent.formGroup(formBuilder);
    fixture.detectChanges();
  }));

  const isOneSelected = (values: any): boolean => {
    let oneSelected = false;
    let allFilters = FiltersComponent.FILTERS;
    for (let i = 0; !oneSelected && i < allFilters.length; i++) {
      let group = allFilters[i];
      for (let j = 0; j < group.filters.length; j++) {
        let filter = group.filters[j];
        oneSelected = oneSelected || values[filter.id];
      }
    }
    return oneSelected;
  };

  const isAllSelected = (values: any): boolean => {
    let allSelected = true;
    let allFilters = FiltersComponent.FILTERS;
    for (let i = 0; allSelected && i < allFilters.length; i++) {
      let group = allFilters[i];
      for (let j = 0; j < group.filters.length; j++) {
        let filter = group.filters[j];
        allSelected = allSelected && values[filter.id];
      }
    }
    return allSelected;
  };

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select all checkboxes', () => {
    // By default, nothing is selected, so at least one item is not selected.
    let values = component.filtersForm.value;
    let allSelected: boolean = isAllSelected(values);
    expect(allSelected).toBeFalse();

    // Now we select everything...
    component.selectAll();

    // We must retrieve the form values again since selectAll() injects a new dictionary.
    values = component.filtersForm.value;
    allSelected = isAllSelected(values);
    expect(allSelected).toBeTrue();
  });

  it('should deselect all checkboxes', () => {
    // Since nothing is selected by default, we select at least an item
    // so that deselectAll() actually deselects something.
    let values = component.filtersForm.value;
    values.is_item = true;
    let oneSelected: boolean = isOneSelected(values);
    expect(oneSelected).toBeTrue();

    // Now we deselect everything...
    component.deselectAll();

    // We must retrieve the form values again since deselectAll() injects a new dictionary.
    values = component.filtersForm.value;
    oneSelected = isOneSelected(values);
    expect(oneSelected).toBeFalse();
  });
});
