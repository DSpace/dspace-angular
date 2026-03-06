import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { ConfidenceType } from '@dspace/core/shared/confidence-type';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { Vocabulary } from '@dspace/core/submission/vocabularies/models/vocabulary.model';
import { VocabularyEntryDetail } from '@dspace/core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
  isNotNull,
} from '@dspace/shared/utils/empty.util';
import {
  NgbModal,
  NgbModalRef,
  NgbTypeahead,
  NgbTypeaheadModule,
  NgbTypeaheadSelectItemEvent,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeWith,
  take,
  tap,
} from 'rxjs/operators';
import { SearchService } from 'src/app/shared/search/search.service';

import { ObjNgFor } from '../../../../../utils/object-ngfor.pipe';
import { AuthorityConfidenceStateDirective } from '../../../../directives/authority-confidence-state.directive';
import { VocabularyTreeviewModalComponent } from '../../../../vocabulary-treeview-modal/vocabulary-treeview-modal.component';
import { DsDynamicVocabularyComponent } from '../dynamic-vocabulary.component';
import { DynamicOneboxModel } from './dynamic-onebox.model';

/**
 * Component representing a onebox input field.
 * If field has a Hierarchical Vocabulary configured, it's rendered with vocabulary tree
 */
@Component({
  selector: 'ds-dynamic-onebox',
  styleUrls: ['./dynamic-onebox.component.scss'],
  templateUrl: './dynamic-onebox.component.html',
  imports: [
    AsyncPipe,
    AuthorityConfidenceStateDirective,
    FormsModule,
    FormsModule,
    NgbTypeaheadModule,
    NgbTypeaheadModule,
    ObjNgFor,
    TranslateModule,
  ],
})
export class DsDynamicOneboxComponent extends DsDynamicVocabularyComponent implements OnDestroy, OnInit {

  @Input() group: UntypedFormGroup;
  @Input() model: DynamicOneboxModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('typeahead') typeahead: NgbTypeahead;

  pageInfo = new PageInfo();
  loading = false;
  searchFailed = false;
  click$ = new Subject<string>();
  currentValue: any;
  inputValue: any;

  get isSolrSuggest() {
    return this.model.vocabularyOptions?.type === 'suggest';
  }

  get vocabularyName() {
    return this.model.vocabularyOptions?.name;
  }

  get vocabulary$() {
    if (this.isSolrSuggest) {
      return of();
    }

    return this.vocabularyService.findVocabularyById(
      this.model.vocabularyOptions.name).pipe(
      getFirstSucceededRemoteDataPayload(),
      distinctUntilChanged());
  }

  private subs: Subscription[] = [];

  /**
   * Converts a stream of text values from the `<input>` element to a stream
   * of search terms to send to the Solr suggest request handler for lookup
   * of values in metadata or a flat file dictionary
  */
  search = (text$: Observable<string>) => text$.pipe(
    mergeWith(this.click$),
    debounceTime(300),
    distinctUntilChanged(),
    concatMap((term: string) => {
      this.changeLoadingStatus(true);
      this.searchFailed = false;

      if (term === '' || term.length < this.model.minChars) {
        return of([]);
      }

      if (this.isSolrSuggest) {
        return this.searchService.getSuggestionsFor(
          term, this.vocabularyName);
      }

      return this.vocabularyService.getVocabularyEntriesByValue(
        term,
        false,
        this.model.vocabularyOptions,
        new PageInfo()).pipe(getFirstSucceededRemoteDataPayload());
    }),
    tap(() => this.searchFailed = false),
    catchError((err: unknown) => {
      console.error('Onebox search failed', err);
      this.searchFailed = true;
      return of([]);
    }),
    tap(() => this.changeLoadingStatus(false)));

  constructor(protected vocabularyService: VocabularyService,
              protected cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected modalService: NgbModal,
              protected validationService: DynamicFormValidationService,
              protected searchService: SearchService,
  ) {
    super(vocabularyService, layoutService, validationService);
  }

  /**
   * Initialize the component, setting up the init form value
   */
  ngOnInit() {
    if (this.model.value) {
      this.setCurrentValue(this.model.value, !this.isSolrSuggest);
    }

    this.subs.push(this.group.get(this.model.id).valueChanges.pipe(
      filter((value) => this.currentValue !== value))
      .subscribe(() => {
        this.setCurrentValue(this.model.value);
      }));
  }

  /**
   * Changes the searching status
   * @param loading
   */
  changeLoadingStatus(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

  /**
   * Update the input value with a FormFieldMetadataValueObject
   * @param event
   */
  onInput(event: any) {
    if (!this.model.vocabularyOptions.closed
      && isNotEmpty(event.target.value)) {
      this.inputValue = new FormFieldMetadataValueObject(event.target.value);
    }
  }

  /**
   * Emits a blur event containing a given value.
   * @param event The value to emit.
   */
  onBlur(event: Event) {
    if (!this.typeahead.isPopupOpen()) {
      if (!this.model.vocabularyOptions.closed && isNotEmpty(this.inputValue)) {
        if (isNotNull(this.inputValue) && this.model.value !== this.inputValue) {
          this.dispatchUpdate(this.inputValue);
        }
        this.inputValue = null;
      }
      this.blur.emit(event);
    } else {
      // prevent on blur propagation if typeahed suggestions are showed
      event.preventDefault();
      event.stopImmediatePropagation();
      // update the value with the searched text if the user hasn't selected any suggestion
      if (!this.model.vocabularyOptions.closed && isNotEmpty(this.inputValue)) {
        if (isNotNull(this.inputValue) && this.model.value !== this.inputValue) {
          this.dispatchUpdate(this.inputValue);
        }
        this.inputValue = null;
      }
    }

    if (this.model.vocabularyOptions.type === 'suggest') {
      this.dispatchUpdate(this.currentValue);
    }

  }

  /**
   * Updates model value with the current value
   * @param event The change event.
   */
  onChange(event: Event) {
    event.stopPropagation();
    if (isEmpty(this.currentValue)) {
      this.dispatchUpdate(null);
    }
  }

  /**
   * Updates current value and model value with the selected value.
   * @param event The value to set.
   */
  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.inputValue = null;
    this.setCurrentValue(event.item);
    this.dispatchUpdate(event.item);
  }

  onSelectSuggestedTerm(event: NgbTypeaheadSelectItemEvent) {
    const sanitizedTerm = (event.item.term + '').replace('<b>', '').replace('</b>', '');
    const ve: VocabularyEntryDetail = Object.assign({
      display: sanitizedTerm,
      value: sanitizedTerm,
      selectable: true,
    });
    this.inputValue = ve;
    this.setCurrentValue(ve);
    this.dispatchUpdate(ve);
  }

  /**
   * Open modal to show tree for hierarchical vocabulary
   * @param event The click event fired
   */
  openTree(event: Event) {
    if (this.model.readOnly) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this.subs.push(this.vocabulary$.pipe(
      map((vocabulary: Vocabulary) => vocabulary.preloadLevel),
      take(1),
    ).subscribe((preloadLevel) => {
      const modalRef: NgbModalRef = this.modalService.open(VocabularyTreeviewModalComponent, { size: 'lg', windowClass: 'treeview' });
      modalRef.componentInstance.vocabularyOptions = this.model.vocabularyOptions;
      modalRef.componentInstance.preloadLevel = preloadLevel;
      modalRef.componentInstance.selectedItems = this.currentValue ? [this.currentValue] : [];
      modalRef.result.then((result: VocabularyEntryDetail) => {
        if (result) {
          this.currentValue = result;
          this.dispatchUpdate(result);
        }
      }, () => {
        return;
      });
    }));
  }

  /**
   * Callback functions for whenClickOnConfidenceNotAccepted event
   */
  public whenClickOnConfidenceNotAccepted(_confidence: ConfidenceType) {
    if (!this.model.readOnly) {
      this.click$.next(this.currentValue);
    }
  }

  /**
   * Sets the current value with the given value.
   * @param value The value to set.
   * @param init Representing if is init value or not.
   */
  setCurrentValue(value: any, init = false): void {
    let result: string;
    if (init) {
      this.changeLoadingStatus(true);
      this.getInitValueFromModel(true)
        .subscribe((formValue: FormFieldMetadataValueObject) => {
          this.changeLoadingStatus(false);
          this.currentValue = formValue;
          this.cdr.detectChanges();
        });
    } else {
      if (isEmpty(value)) {
        result = '';
      } else {
        result = value.value;
      }

      this.currentValue = result;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
