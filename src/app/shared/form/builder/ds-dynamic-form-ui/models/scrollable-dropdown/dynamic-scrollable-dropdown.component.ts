import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of as observableOf } from 'rxjs';
import { catchError, distinctUntilChanged, tap } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyFindOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-find-options.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { PaginatedList } from '../../../../../../core/data/paginated-list';

@Component({
  selector: 'ds-dynamic-scrollable-dropdown',
  styleUrls: ['./dynamic-scrollable-dropdown.component.scss'],
  templateUrl: './dynamic-scrollable-dropdown.component.html'
})
export class DsDynamicScrollableDropdownComponent extends DynamicFormControlComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicScrollableDropdownModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public currentValue: Observable<string>;
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;

  protected searchOptions: VocabularyFindOptions;

  constructor(private vocabularyService: VocabularyService,
              private cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    this.searchOptions = new VocabularyFindOptions(
      this.model.vocabularyOptions.scope,
      this.model.vocabularyOptions.name,
      this.model.vocabularyOptions.metadata,
      '',
      this.model.maxOptions,
      1);
    this.vocabularyService.getVocabularyEntries(this.searchOptions).pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() => observableOf(new PaginatedList(
        new PageInfo(),
        []
        ))
      ))
      .subscribe((list: PaginatedList<VocabularyEntry>) => {
        this.optionsList = list.page;
        if (this.model.value) {
          this.setCurrentValue(this.model.value);
        }
        this.pageInfo = list.pageInfo;
        this.cdr.detectChanges();
      });

    this.group.get(this.model.id).valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.setCurrentValue(value);
      });

  }

  inputFormatter = (x: VocabularyEntry): string => x.display || x.value;

  openDropdown(sdRef: NgbDropdown) {
    if (!this.model.readOnly) {
      sdRef.open();
    }
  }

  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.loading = true;
      this.searchOptions.currentPage++;
      this.vocabularyService.getVocabularyEntries(this.searchOptions).pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError(() => observableOf(new PaginatedList(
          new PageInfo(),
          []
          ))
        ),
        tap(() => this.loading = false))
        .subscribe((list: PaginatedList<VocabularyEntry>) => {
          this.optionsList = this.optionsList.concat(list.page);
          this.pageInfo = list.pageInfo;
          this.cdr.detectChanges();
        })
    }
  }

  onBlur(event: Event) {
    this.blur.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  onSelect(event) {
    this.group.markAsDirty();
    this.model.valueUpdates.next(event);
    this.change.emit(event);
    this.setCurrentValue(event);
  }

  onToggle(sdRef: NgbDropdown) {
    if (sdRef.isOpen()) {
      this.focus.emit(event);
    } else {
      this.blur.emit(event);
    }
  }

  setCurrentValue(value): void {
    let result: string;
    if (isUndefined(value) || isNull(value)) {
      result = '';
    } else if (typeof value === 'string') {
      result = value;
    } else {
      for (const item of this.optionsList) {
        if (value.value === (item as any).value) {
          result = this.inputFormatter(item);
          break;
        }
      }
    }
    this.currentValue = observableOf(result);
  }
}
