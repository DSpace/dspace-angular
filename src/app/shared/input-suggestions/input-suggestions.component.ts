import {
  Component,
  ElementRef, EventEmitter,
  Input,
  Output,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { hasValue, isNotEmpty } from '../empty.util';

@Component({
  selector: 'ds-input-suggestions',
  styleUrls: ['./input-suggestions.component.scss'],
  templateUrl: './input-suggestions.component.html'
})

/**
 * Component representing a form with a autocomplete functionality
 */
export class InputSuggestionsComponent {
  /**
   * The suggestions that should be shown
   */
  @Input() suggestions: any[] = [];

  /**
   * The time waited to detect if any other input will follow before requesting the suggestions
   */
  @Input() debounceTime = 500;

  /**
   * Placeholder attribute for the input field
   */
  @Input() placeholder = '';

  /**
   * Action attribute for the form
   */
  @Input() action;

  /**
   * Name attribute for the input field
   */
  @Input() name;

  /**
   * Value of the input field
   */
  @Input() ngModel;

  /**
   * Output for when the input field's value changes
   */
  @Output() ngModelChange = new EventEmitter();

  /**
   * Output for when the form is submitted
   */
  @Output() submitSuggestion = new EventEmitter();

  /**
   * Output for when a suggestion is clicked
   */
  @Output() clickSuggestion = new EventEmitter();

  /**
   * Output for when new suggestions should be requested
   */
  @Output() findSuggestions = new EventEmitter();

  /**
   * Emits true when the list of suggestions should be shown
   */
  show = new BehaviorSubject<boolean>(false);

  /**
   * Index of the currently selected suggestion
   */
  selectedIndex = -1;

  /**
   * Reference to the input field component
   */
  @ViewChild('inputField') queryInput: ElementRef;
  /**
   * Reference to the suggestion components
   */
  @ViewChildren('suggestion') resultViews: QueryList<ElementRef>;

  /**
   * When any of the inputs change, check if we should still show the suggestions
   */
  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.suggestions)) {
      this.show.next(isNotEmpty(changes.suggestions.currentValue));
    }
  }

  /**
   * Move the focus on one of the suggestions up to the previous suggestion
   * When no suggestion is currently in focus OR the first suggestion is in focus: shift to the last suggestion
   */
  shiftFocusUp(event: KeyboardEvent) {
    event.preventDefault();
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.selectedIndex = (this.selectedIndex + this.resultViews.length) % this.resultViews.length; // Prevent negative modulo outcome
    } else {
      this.selectedIndex = this.resultViews.length - 1;
    }
    this.changeFocus();
  }

  /**
   * Move the focus on one of the suggestions up to the next suggestion
   * When no suggestion is currently in focus OR the last suggestion is in focus: shift to the first suggestion
   */
  shiftFocusDown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.selectedIndex >= 0) {
      this.selectedIndex++;
      this.selectedIndex %= this.resultViews.length;
    } else {
      this.selectedIndex = 0;
    }
    this.changeFocus();
  }

  /**
   * Perform the change of focus to the current selectedIndex
   */
  changeFocus() {
    if (this.resultViews.length > 0) {
      this.resultViews.toArray()[this.selectedIndex].nativeElement.focus();
    }
  }

  /**
   * When any key is pressed (except for the Enter button) the query input should move to the input field
   * @param {KeyboardEvent} event The keyboard event
   */
  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.queryInput.nativeElement.focus();
    }
  }

  /**
   * Changes the show variable so the suggestion dropdown closes
   */
  close() {
    this.show.next(false);
  }

  /**
   * For usage of the isNotEmpty function in the template
   */
  isNotEmpty(data) {
    return isNotEmpty(data);
  }

  /**
   * Make sure that if a suggestion is clicked, the suggestions dropdown closes and the focus moves to the input field
   */
  onClickSuggestion(data) {
    this.clickSuggestion.emit(data);
    this.close();
    this.queryInput.nativeElement.focus();
    return false;
  }

}
