import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTypeaheadModel } from './dynamic-typeahead.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { isNotEmpty } from '../../../../../empty.util';

@Component({
  selector: 'ds-dynamic-typeahead',
  styleUrls: ['./dynamic-typeahead.component.scss'],
  templateUrl: './dynamic-typeahead.component.html'
})
export class DsDynamicTypeaheadComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicTypeaheadModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  searching = false;
  searchOptions: IntegrationSearchOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  currentValue: any;

  formatter = (x: {display: string}) => x.display;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap((term) => {
        if (term === '' || term.length < this.model.minChars) {
          return Observable.of({list: []});
        } else {
          this.searchOptions.query = term;
          return this.authorityService.getEntriesByName(this.searchOptions)
            .map((authorities) => {
              // @TODO Pagination for authority is not working, to refactor when it will be fixed
              return {
                list: authorities.payload,
                pageInfo: authorities.pageInfo
              }
            })
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of({list: []});
            })
        }
      })
      .map((results) => results.list)
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);

  constructor(private authorityService: AuthorityService) {}

  ngOnInit() {
    this.currentValue = this.model.value;
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata);
    this.group.valueChanges.subscribe((value) => {
      if (this.currentValue !== value && isNotEmpty(value[this.model.id])) {
        this.currentValue = value[this.model.id];
      }
    })
  }

  onInput(event) {
    if (event.data) {
      this.group.markAsDirty();
    }
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent($event) {
    this.focus.emit(event);
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.currentValue = event.item;
    this.group.controls[this.model.id].setValue(event.item);
    this.change.emit(event.item);
  }
}
