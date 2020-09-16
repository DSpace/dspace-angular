import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MetadataFieldDataService } from '../../../core/data/metadata-field-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { FilterInputSuggestionsComponent } from './filter-input-suggestions.component';

describe('FilterInputSuggestionsComponent', () => {

  let comp: FilterInputSuggestionsComponent;
  let fixture: ComponentFixture<FilterInputSuggestionsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const suggestions = [{ displayValue: 'suggestion uno', value: 'suggestion uno' }, {
    displayValue: 'suggestion dos',
    value: 'suggestion dos'
  }, { displayValue: 'suggestion tres', value: 'suggestion tres' }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, FormsModule, ReactiveFormsModule],
      declarations: [FilterInputSuggestionsComponent],
      providers: [FormsModule,
        ReactiveFormsModule,
        { provide: MetadataFieldDataService, useValue: {} },
        { provide: ObjectUpdatesService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(FilterInputSuggestionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputSuggestionsComponent);

    comp = fixture.componentInstance; // LoadingComponent test instance
    comp.suggestions = suggestions;
    // query for the message <label> by CSS element selector
    de = fixture.debugElement;
    el = de.nativeElement;
    comp.show.next(true);
    fixture.detectChanges();
  });

  describe('when an element is clicked', () => {
    const clickedIndex = 0;
    beforeEach(() => {
      spyOn(comp, 'onClickSuggestion');
      const clickedLink = de.query(By.css('.dropdown-list > div:nth-child(' + (clickedIndex + 1) + ') a'));
      clickedLink.triggerEventHandler('click', {});
      fixture.detectChanges();
    });
    it('should call onClickSuggestion() with the suggestion as a parameter', () => {
      expect(comp.onClickSuggestion).toHaveBeenCalledWith(suggestions[clickedIndex].value);
    });
  });
});
