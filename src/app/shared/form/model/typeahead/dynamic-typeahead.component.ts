import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DynamicTypeaheadModel, DynamicTypeaheadModelConfig } from './dynamic-typeahead.model';
import { Jsonp, URLSearchParams } from '@angular/http';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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

  searching = true;
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

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    console.log(this.group);
    if (event.item.id) {
      this.group.controls[this.model.id].setValue(event.item.id);
    } else if (event.item.value) {
      this.group.controls[this.model.id].setValue(event.item.value);
    }
    console.log(this.group);
  }
}
