import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, merge, switchMap, tap } from 'rxjs/operators';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTypeaheadModel } from './dynamic-typeahead.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { isEmpty, isNotEmpty, isNotNull } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { ConfidenceType } from '../../../../../../core/integration/models/confidence-type';

@Component({
  selector: 'ds-dynamic-typeahead',
  styleUrls: ['./dynamic-typeahead.component.scss'],
  templateUrl: './dynamic-typeahead.component.html'
})
export class DsDynamicTypeaheadComponent extends DynamicFormControlComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicTypeaheadModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('instance', {static: false}) instance: NgbTypeahead;

  searching = false;
  searchOptions: IntegrationSearchOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed$ = new Observable(() => () => this.changeSearchingStatus(false));
  click$ = new Subject<string>();
  currentValue: any;
  inputValue: any;

  formatter = (x: { display: string }) => {
    return (typeof x === 'object') ? x.display : x
  };

  search = (text$: Observable<string>) => {
    return text$.pipe(
      merge(this.click$),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.changeSearchingStatus(true)),
      switchMap((term) => {
        if (term === '' || term.length < this.model.minChars) {
          return observableOf({list: []});
        } else {
          this.searchOptions.query = term;
          return this.authorityService.getEntriesByName(this.searchOptions).pipe(
            map((authorities) => {
              // @TODO Pagination for authority is not working, to refactor when it will be fixed
              return {
                list: authorities.payload,
                pageInfo: authorities.pageInfo
              };
            }),
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return observableOf({list: []});
            }));
        }
      }),
      map((results) => results.list),
      tap(() => this.changeSearchingStatus(false)),
      merge(this.hideSearchingWhenUnsubscribed$)
    )
  };

  constructor(private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    this.currentValue = this.model.value;
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityOptions.scope,
      this.model.authorityOptions.name,
      this.model.authorityOptions.metadata);
    this.group.get(this.model.id).valueChanges.pipe(
      filter((value) => this.currentValue !== value))
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
      this.inputValue = new FormFieldMetadataValueObject(event.target.value);
    }
  }

  onBlur(event: Event) {
    if (!this.instance.isPopupOpen()) {
      if (!this.model.authorityOptions.closed && isNotEmpty(this.inputValue)) {
        if (isNotNull(this.inputValue) && this.model.value !== this.inputValue) {
          this.model.valueUpdates.next(this.inputValue);
          this.change.emit(this.inputValue);
        }
        this.inputValue = null;
      }
      this.blur.emit(event);
    } else {
      // prevent on blur propagation if typeahed suggestions are showed
      event.preventDefault();
      event.stopImmediatePropagation();
      // set focus on input again, this is to avoid to lose changes when no suggestion is selected
      (event.target as HTMLInputElement).focus();
    }
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

  public whenClickOnConfidenceNotAccepted(confidence: ConfidenceType) {
    if (!this.model.readOnly) {
      this.click$.next(this.formatter(this.currentValue));
    }
  }

}
