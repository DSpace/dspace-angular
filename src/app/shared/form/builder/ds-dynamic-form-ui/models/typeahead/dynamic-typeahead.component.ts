import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DynamicTypeaheadModel, DynamicTypeaheadModelConfig } from './dynamic-typeahead.model';
import { Jsonp, URLSearchParams } from '@angular/http';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ds-dynamic-typeahead',
  styleUrls: ['./dynamic-typeahead.component.scss'],
  templateUrl: './dynamic-typeahead.component.html'
})
export class DsDynamicTypeaheadComponent {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicTypeaheadModel;
  @Input() showErrorMessages = false;

  /**
   * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
   */
  @Output() selectItem = new EventEmitter<any>();

  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  value: any;

  formatter = (x: {display: string}) => x.display;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap((term) => {
        if (term === '' || term.length < this.model.minChars) {
          return Observable.of([]);
        } else {
          return this.model.search(term)
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of([]);
            })
        }
      })
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);

  onInput(event) {
    if (event.data) {
      this.group.markAsDirty();
    }
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.group.controls[this.model.id].setValue(event.item);
  }
}
