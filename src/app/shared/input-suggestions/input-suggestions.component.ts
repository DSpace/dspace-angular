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
import { ActivatedRoute } from '@angular/router';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-input-suggestions',
  styleUrls: ['./input-suggestions.component.scss'],
  templateUrl: './input-suggestions.component.html'
})

export class InputSuggestionsComponent {
  @Input() suggestions: string[] = [];
  @Input() debounceTime = 500;
  @Input() placeholder = '';
  @Input() action;
  @Input() name;
  @Input() ngModel;
  @Output() ngModelChange = new EventEmitter();
  @Output() submitSuggestion = new EventEmitter();
  @Output() clickSuggestion = new EventEmitter();
  @Output() findSuggestions = new EventEmitter();
  show = new BehaviorSubject<boolean>(false);
  selectedIndex = -1;
  @ViewChild('inputField') queryInput: ElementRef;
  @ViewChildren('suggestion') resultViews: QueryList<ElementRef>;
  @Input() getDisplayValue: (value: string, query: string) => string = (value: string, query: string) => value;

  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.suggestions)) {
      this.show.next(isNotEmpty(changes.suggestions.currentValue));
    }
  }

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

  changeFocus() {
    if (this.resultViews.length > 0) {
      this.resultViews.toArray()[this.selectedIndex].nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.queryInput.nativeElement.focus();
    }
  }

  close() {
    this.show.next(false);
  }

  isNotEmpty(data) {
    return isNotEmpty(data);
  }

  onClickSuggestion(data) {
    this.clickSuggestion.emit(data);
    return false;
  }

}
