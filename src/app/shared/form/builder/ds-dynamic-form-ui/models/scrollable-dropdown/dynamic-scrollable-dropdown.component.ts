import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isEmpty } from '../../../../../empty.util';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { buildPaginatedList, PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { DsDynamicVocabularyComponent } from '../dynamic-vocabulary.component';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { FormBuilderService } from '../../../form-builder.service';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { RemoteData } from '../../../../../../core/data/remote-data';

/**
 * Component representing a dropdown input field
 */
@Component({
  selector: 'ds-dynamic-scrollable-dropdown',
  styleUrls: ['./dynamic-scrollable-dropdown.component.scss'],
  templateUrl: './dynamic-scrollable-dropdown.component.html'
})
export class DsDynamicScrollableDropdownComponent extends DsDynamicVocabularyComponent implements OnInit, OnDestroy {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicScrollableDropdownModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public currentValue: Observable<string>;
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: VocabularyEntry[] = [];


  /**
   * The text that is being searched
   */
  searchText: string = null;

  /**
   * The subject that is being subscribed to understand when the change happens to implement debounce
   */
  filterTextChanged: Subject<string> = new Subject<string>();

  /**
   * The subscribtion to be utilized on destroy to remove filterTextChange subscription
   */
  subSearch: Subscription;

  constructor(protected vocabularyService: VocabularyService,
              protected cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected formBuilderService: FormBuilderService,
              protected modalService: NgbModal,
              protected submissionService: SubmissionService
  ) {
    super(vocabularyService, layoutService, validationService, formBuilderService, modalService, submissionService);
  }

  /**
   * Initialize the component, setting up the init form value
   */
  ngOnInit() {
    this.updatePageInfo(this.model.maxOptions, 1);
    this.retrieveEntries(null, true);

    this.group.get(this.model.id).valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.setCurrentValue(value);
      });
    this.initFilterSubscriber();
  }


  /**
   * Start subscription for filterTextChange to detect change and implement debounce
   */
  initFilterSubscriber(): void {
    this.subSearch = this.filterTextChanged.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe((searchText) => {
      this.retrieveEntries(searchText);
    });
  }

  /**
   * On input change value we set the change to filterTextChanged subject
   */
  filter(filterText: string) {
    this.filterTextChanged.next(filterText);
  }


  /**
   * Converts an item from the result list to a `string` to display in the `<input>` field.
   */
  inputFormatter = (x: VocabularyEntry): string => x.display || x.value;

  /**
   * Opens dropdown menu
   * @param sdRef The reference of the NgbDropdown.
   */
  openDropdown(sdRef: NgbDropdown) {
    if (!this.model.readOnly) {
      this.group.markAsUntouched();
      sdRef.open();
    }
  }

  /**
   * Loads any new entries
   */
  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.loading = true;
      this.updatePageInfo(
        this.pageInfo.elementsPerPage,
        this.pageInfo.currentPage + 1,
        this.pageInfo.totalElements,
        this.pageInfo.totalPages
      );
      this.retrieveEntries(this.searchText, false, true);
    }
  }

  /**
   * Emits a change event and set the current value with the given value.
   * @param event The value to emit.
   */
  onSelect(event) {
    this.group.markAsDirty();
    this.dispatchUpdate(event);
    this.setCurrentValue(event);
  }

  /**
   * Sets the current value with the given value.
   * @param value The value to set.
   * @param init Representing if is init value or not.
   */
  setCurrentValue(value: any, init = false): void {
    let result: Observable<string>;

    if (init) {
      result = this.getInitValueFromModel().pipe(
        map((formValue: FormFieldMetadataValueObject) => formValue.display)
      );
    } else {
      if (isEmpty(value)) {
        result = observableOf('');
      } else if (typeof value === 'string') {
        result = observableOf(value);
      } else {
        result = observableOf(value.display);
      }
    }

    this.currentValue = result;
  }

  /**
   * Retrieve entries from vocabulary
   * @param searchText If present filter entries for the given text
   * @param initModel  If true set the current value
   * @param concatResults  If true concat results to the current list
   * @private
   */
  private retrieveEntries(searchText = null, initModel = false, concatResults = false) {
    this.searchText = searchText;
    let search$: Observable<RemoteData<PaginatedList<VocabularyEntry>>>;
    if (searchText) {
      search$ = this.vocabularyService.getVocabularyEntriesByValue(this.searchText, false, this.model.vocabularyOptions, this.pageInfo);
    } else {
      search$ = this.vocabularyService.getVocabularyEntries(this.model.vocabularyOptions, this.pageInfo);
    }
    search$.pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() => observableOf(buildPaginatedList(
          new PageInfo(),
          []
        ))
      ),
      tap(() => this.loading = false))
      .subscribe((list: PaginatedList<VocabularyEntry>) => {
        this.optionsList = (concatResults) ? this.optionsList.concat(list.page) : list.page;
        if (initModel && this.model.value) {
          this.setCurrentValue(this.model.value, true);
        }
        this.updatePageInfo(
          list.pageInfo.elementsPerPage,
          list.pageInfo.currentPage,
          list.pageInfo.totalElements,
          list.pageInfo.totalPages
        );
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.subSearch.unsubscribe();
  }

}
