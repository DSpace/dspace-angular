import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, merge, switchMap, tap } from 'rxjs/operators';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { isEqual } from 'lodash';

import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { DynamicTagModel } from './dynamic-tag.model';
import { VocabularyFindOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-find-options.model';
import { Chips } from '../../../../../chips/models/chips.model';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { environment } from '../../../../../../../environments/environment';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';

@Component({
  selector: 'ds-dynamic-tag',
  styleUrls: ['./dynamic-tag.component.scss'],
  templateUrl: './dynamic-tag.component.html'
})
export class DsDynamicTagComponent extends DynamicFormControlComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicTagModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('instance', { static: false }) instance: NgbTypeahead;

  chips: Chips;
  hasAuthority: boolean;

  searching = false;
  searchOptions: VocabularyFindOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.changeSearchingStatus(false));
  currentValue: any;

  constructor(private vocabularyService: VocabularyService,
              private cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  formatter = (x: { display: string }) => x.display;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.changeSearchingStatus(true)),
      switchMap((term) => {
        if (term === '' || term.length < this.model.minChars) {
          return observableOf({ list: [] });
        } else {
          this.searchOptions.query = term;
          return this.vocabularyService.getVocabularyEntries(this.searchOptions).pipe(
            getFirstSucceededRemoteDataPayload(),
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return observableOf(new PaginatedList(
                new PageInfo(),
                []
              ));
            }));
        }
      }),
      map((list: PaginatedList<VocabularyEntry>) => list.page),
      tap(() => this.changeSearchingStatus(false)),
      merge(this.hideSearchingWhenUnsubscribed));

  ngOnInit() {
    this.hasAuthority = this.model.vocabularyOptions && hasValue(this.model.vocabularyOptions.name);

    if (this.hasAuthority) {
      this.searchOptions = new VocabularyFindOptions(
        this.model.vocabularyOptions.scope,
        this.model.vocabularyOptions.name,
        this.model.vocabularyOptions.metadata);
    }

    this.chips = new Chips(
      this.model.value,
      'display',
      null,
      environment.submission.icons.metadata);

    this.chips.chipsItems
      .subscribe((subItems: any[]) => {
        const items = this.chips.getChipsItems();
        // Does not emit change if model value is equal to the current value
        if (!isEqual(items, this.model.value)) {
          this.model.valueUpdates.next(items);
          this.change.emit(event);
        }
      });
  }

  changeSearchingStatus(status: boolean) {
    this.searching = status;
    this.cdr.detectChanges();
  }

  onInput(event) {
    if (event.data) {
      this.group.markAsDirty();
    }
    this.cdr.detectChanges();
  }

  onBlur(event: Event) {
    if (isNotEmpty(this.currentValue) && !this.instance.isPopupOpen()) {
      this.addTagsToChips();
    }
    this.blur.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.chips.add(event.item);
    // this.group.controls[this.model.id].setValue(this.model.value);
    this.updateModel(event);

    setTimeout(() => {
      // Reset the input text after x ms, mandatory or the formatter overwrite it
      this.currentValue = null;
      this.cdr.detectChanges();
    }, 50);
  }

  updateModel(event) {
    this.model.valueUpdates.next(this.chips.getChipsItems());
    this.change.emit(event);
  }

  onKeyUp(event) {
    if (event.keyCode === 13 || event.keyCode === 188) {
      event.preventDefault();
      // Key: Enter or ',' or ';'
      this.addTagsToChips();
      event.stopPropagation();
    }
  }

  preventEventsPropagation(event) {
    event.stopPropagation();
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  private addTagsToChips() {
    if (hasValue(this.currentValue) && (!this.hasAuthority || !this.model.vocabularyOptions.closed)) {
      let res: string[] = [];
      res = this.currentValue.split(',');

      const res1 = [];
      res.forEach((item) => {
        item.split(';').forEach((i) => {
          res1.push(i);
        });
      });

      res1.forEach((c) => {
        c = c.trim();
        if (c.length > 0) {
          this.chips.add(c);
        }
      });

      // this.currentValue = '';
      setTimeout(() => {
        // Reset the input text after x ms, mandatory or the formatter overwrite it
        this.currentValue = null;
        this.cdr.detectChanges();
      }, 50);
      this.updateModel(event);
    }
  }
}
