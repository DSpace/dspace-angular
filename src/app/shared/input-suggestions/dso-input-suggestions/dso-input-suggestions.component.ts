import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSuggestionsComponent } from '../input-suggestions.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-dso-input-suggestions',
  styleUrls: ['./../input-suggestions.component.scss'],
  templateUrl: './dso-input-suggestions.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // Usage of forwardRef necessary https://github.com/angular/angular.io/issues/1151
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => DsoInputSuggestionsComponent),
      multi: true
    }
  ]
})

/**
 * Component representing a form with a autocomplete functionality for DSpaceObjects
 */
export class DsoInputSuggestionsComponent extends InputSuggestionsComponent {
  /**
   * The suggestions that should be shown
   */
  @Input() suggestions: DSpaceObject[] = [];

  currentObject: DSpaceObject;

  onSubmit(data: DSpaceObject) {
    this.value = data.name;
    this.currentObject = data;
    this.submitSuggestion.emit(data);
  }

  onClickSuggestion(data: DSpaceObject) {
    this.value = data.name;
    this.currentObject = data;
    this.clickSuggestion.emit(data);
    this.close();
    this.blockReopen = true;
    this.queryInput.nativeElement.focus();
    return false;
  }
}
