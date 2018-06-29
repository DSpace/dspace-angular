import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTypeaheadModel } from './dynamic-typeahead.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { isEmpty, isNotEmpty } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';

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
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.changeSearchingStatus(false));
  currentValue: any;
  inputValue: any;

  formatter = (x: { display: string }) => {
    return (typeof x === 'object') ? x.display : x
  };

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.changeSearchingStatus(true))
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
              };
            })
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of({list: []});
            });
        }
      })
      .map((results) => results.list)
      .do(() => this.changeSearchingStatus(false))
      .merge(this.hideSearchingWhenUnsubscribed);

  constructor(private authorityService: AuthorityService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentValue = this.model.value;
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityOptions.scope,
      this.model.authorityOptions.name,
      this.model.authorityOptions.metadata);
    this.group.get(this.model.id).valueChanges
      .filter((value) => this.currentValue !== value)
      .subscribe((value) => {
        this.currentValue = value;
      });
  }

  changeSearchingStatus(status: boolean) {
    this.searching = status;
    this.cdr.detectChanges();
  }

  onInput(event) {
    if (!this.model.authorityOptions.closed && isNotEmpty(event.target.value)) {
      const valueObj = new FormFieldMetadataValueObject(event.target.value);
      this.inputValue = valueObj;
      this.model.valueUpdates.next(this.inputValue);
    }
  }

  onBlur(event: Event) {
    if (!this.model.authorityOptions.closed && isNotEmpty(this.inputValue)) {
      this.change.emit(this.inputValue);
      this.inputValue = null;
    }
    this.blur.emit(event);
  }

  onChange(event: Event) {
    event.stopPropagation();
    if (isEmpty(this.currentValue)) {
      this.model.valueUpdates.next(null);
      this.change.emit(null);
    }
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.inputValue = null;
    this.currentValue = event.item;
    this.model.valueUpdates.next(event.item);
    this.change.emit(event.item);
  }
}
