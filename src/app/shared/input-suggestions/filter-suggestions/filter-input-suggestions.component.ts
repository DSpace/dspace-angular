import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MetadataFieldValidator } from '../../utils/metadatafield-validator.directive';
import { InputSuggestionsComponent } from '../input-suggestions.component';
import { InputSuggestion } from '../input-suggestions.model';

@Component({
  selector: 'ds-filter-input-suggestions',
  styleUrls: ['./../input-suggestions.component.scss'],
  templateUrl: './filter-input-suggestions.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // Usage of forwardRef necessary https://github.com/angular/angular.io/issues/1151
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => FilterInputSuggestionsComponent),
      multi: true
    }
  ]
})

/**
 * Component representing a form with a autocomplete functionality
 */
export class FilterInputSuggestionsComponent extends InputSuggestionsComponent implements OnInit{

  form: FormGroup;

  /**
   * The suggestions that should be shown
   */
  @Input() suggestions: InputSuggestion[] = [];

  constructor(private metadataFieldValidator: MetadataFieldValidator) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      metadataNameField: new FormControl(this._value, {
        asyncValidators: [this.metadataFieldValidator.validate.bind(this.metadataFieldValidator)],
        validators: [Validators.required]
      })
    });
  }

  onSubmit(data) {
    this.value = data;
    this.submitSuggestion.emit(data);
  }

  onClickSuggestion(data) {
    this.value = data;
    this.clickSuggestion.emit(data);
    this.close();
    this.blockReopen = true;
    this.queryInput.nativeElement.focus();
    return false;
  }

}
