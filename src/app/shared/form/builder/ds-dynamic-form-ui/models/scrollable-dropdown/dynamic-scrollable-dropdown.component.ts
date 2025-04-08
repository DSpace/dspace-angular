import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlCustomEvent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { hasValue, isEmpty } from '../../../../../empty.util';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { buildPaginatedList, PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { DsDynamicVocabularyComponent } from '../dynamic-vocabulary.component';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { FindAllData } from '../../../../../../core/data/base/find-all-data';
import { CacheableObject } from '../../../../../../core/cache/cacheable-object.model';
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
  @ViewChild('dropdownMenu', { read: ElementRef }) dropdownMenu: ElementRef;

  @Input() bindId = true;
  @Input() group: UntypedFormGroup;
  @Input() model: DynamicScrollableDropdownModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  public currentValue: Observable<string>;
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: CacheableObject[] = [];
  public inputText: string = null;
  public selectedIndex = 0;
  public acceptableKeys = ['Space', 'NumpadMultiply', 'NumpadAdd', 'NumpadSubtract', 'NumpadDecimal', 'Semicolon', 'Equal', 'Comma', 'Minus', 'Period', 'Quote', 'Backquote'];

  /**
   * The text that is being searched
   */
  searchText: string = null;

  /**
   * The subject that is being subscribed to understand when the change happens to implement debounce
   */
  filterTextChanged: Subject<string> = new Subject<string>();

  /**
   * The subscription to be utilized on destroy to remove filterTextChange subscription
   */
  subSearch: Subscription;

  /**
   * If true the component can rely on the findAll method for data loading.
   * This is a behaviour activated by dependency injection through the dropdown config.
   * If a service that implements findAll is not provided in the config the component falls back on the standard vocabulary service.
   *
   * @private
   */
  private useFindAllService: boolean;
  /**
   * A service that implements FindAllData.
   * If is provided in the config will be used for data loading in stead of the VocabularyService
   * @private
   */
  private findAllService: FindAllData<CacheableObject>;

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
    this.findAllService = this.model?.findAllFactory();
    this.useFindAllService = hasValue(this.findAllService?.findAll) && typeof this.findAllService.findAll === 'function';

    if (this.model.metadataValue) {
      this.setCurrentValue(this.model.metadataValue, true);
    }

    this.updatePageInfo(this.model.maxOptions, 1);
    this.loadOptions(null, true);

    this.group.get(this.model.id).valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.setCurrentValue(value, true);
      });
    this.initFilterSubscriber();
  }

  /**
   * Get service and method to use to retrieve dropdown options
   */
  getDataFromService(searchText: string, isScrolling: boolean): Observable<RemoteData<PaginatedList<CacheableObject>>> {
    if (this.useFindAllService) {
      return this.findAllService.findAll({ elementsPerPage: this.pageInfo.elementsPerPage, currentPage: this.pageInfo.currentPage });
    } else {
      if (searchText) {
        const searchPageInfo = Object.assign(new PageInfo(), {
          elementsPerPage: this.pageInfo.elementsPerPage,
          currentPage: isScrolling ? this.pageInfo.currentPage : 1,
          totalElements: this.pageInfo.totalElements,
          totalPages: this.pageInfo.totalPages });
        return this.vocabularyService.getVocabularyEntriesByValue(this.searchText, false, this.model.vocabularyOptions,
          searchPageInfo);
      } else {
        return this.vocabularyService.getVocabularyEntries(this.model.vocabularyOptions, this.pageInfo);
      }
    }
  }

  /**
   * Retrieve entries from vocabulary
   * @param searchText If present filter entries for the given text
   * @param initModel  If true set the current value
   * @param concatResults  If true concat results to the current list
   * @param isScrolling  If true scrolling is in progress
   * @private
   */
  loadOptions(searchText = null, initModel = false, concatResults = false, isScrolling = false) {
    this.searchText = searchText;
    this.getDataFromService(searchText, isScrolling).pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() => observableOf(buildPaginatedList(
          new PageInfo(),
          []
        ))
      ),
      tap(() => this.loading = false)
    ).subscribe((list: PaginatedList<CacheableObject>) => {
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
      this.selectedIndex = 0;
      this.cdr.detectChanges();
    });
  }

  /**
   * Start subscription for filterTextChange to detect change and implement debounce
   */
  initFilterSubscriber(): void {
    this.subSearch = this.filterTextChanged.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe((searchText) => {
      this.loadOptions(searchText);
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
  inputFormatter = (x: any): string => (this.model.formatFunction ? this.model.formatFunction(x) : (x.display || x.value));

  /**
   * Opens dropdown menu
   * @param sdRef The reference of the NgbDropdown.
   */
  openDropdown(sdRef: NgbDropdown) {
    if (!this.model.readOnly) {
      this.group.markAsUntouched();
      this.inputText = null;
      this.updatePageInfo(this.model.maxOptions, 1);
      this.loadOptions(null, false);
      sdRef.open();
    }
  }

  navigateDropdown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.optionsList.length - 1);
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    }
    this.scrollToSelected();
  }

  scrollToSelected() {
    const dropdownItems = this.dropdownMenu.nativeElement.querySelectorAll('.dropdown-item');
    const selectedItem = dropdownItems[this.selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * KeyDown handler to allow toggling the dropdown via keyboard
   * @param event KeyboardEvent
   * @param sdRef The reference of the NgbDropdown.
   */
  selectOnKeyDown(event: KeyboardEvent, sdRef: NgbDropdown) {
    const keyName = event.key;

    if (keyName === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      if (sdRef.isOpen()) {
        this.onSelect(this.optionsList[this.selectedIndex]);
        sdRef.close();
      } else {
        sdRef.open();
      }
    } else if (keyName === 'ArrowDown' || keyName === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      this.navigateDropdown(event);
    } else if (keyName === 'Backspace') {
      this.removeKeyFromInput();
    } else if (this.isAcceptableKey(keyName)) {
      this.addKeyToInput(keyName);
    }
  }

  addKeyToInput(keyName: string) {
    if (this.inputText === null) {
      this.inputText = '';
    }
    this.inputText += keyName;
    // When a new key is added, we need to reset the page info
    this.updatePageInfo(this.model.maxOptions, 1);
    this.loadOptions(this.inputText, false);
  }

  removeKeyFromInput() {
    if (this.inputText !== null) {
      this.inputText = this.inputText.slice(0, -1);
      if (this.inputText === '') {
        this.inputText = null;
      }
      this.loadOptions(this.inputText, false);
    }
  }


  isAcceptableKey(keyPress: string): boolean {
    // allow all letters and numbers
    if (keyPress.length === 1 && keyPress.match(/^[a-zA-Z0-9]*$/)) {
      return true;
    }
    // Some other characters like space, dash, etc should be allowed as well
    return this.acceptableKeys.includes(keyPress);
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
      this.loadOptions(this.searchText, false, true, true);
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

    if (init && !this.useFindAllService) {
      result = this.getInitValueFromModel().pipe(
        map((formValue: FormFieldMetadataValueObject) => formValue.display)
      );
    } else {
      if (isEmpty(value)) {
        result = observableOf('');
      } else if (typeof value === 'string') {
        result = observableOf(value);
      } else if (this.useFindAllService) {
        result = observableOf(value[this.model.displayKey]);
      } else {
        result = observableOf(value.display);
      }
    }

    this.currentValue = result;
  }

  ngOnDestroy() {
    this.subSearch.unsubscribe();
  }

}
