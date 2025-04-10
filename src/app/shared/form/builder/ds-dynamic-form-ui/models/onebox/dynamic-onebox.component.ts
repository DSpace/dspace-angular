import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import {
  DynamicFormControlCustomEvent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { DynamicOneboxModel } from './dynamic-onebox.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { ConfidenceType } from '../../../../../../core/shared/confidence-type';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { buildPaginatedList, PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { DsDynamicVocabularyComponent } from '../dynamic-vocabulary.component';
import { Vocabulary } from '../../../../../../core/submission/vocabularies/models/vocabulary.model';
import {
  VocabularyTreeviewModalComponent
} from '../../../../vocabulary-treeview-modal/vocabulary-treeview-modal.component';
import { FormBuilderService } from '../../../form-builder.service';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { environment } from '../../../../../../../environments/environment';

/**
 * Component representing a onebox input field.
 * If field has a Hierarchical Vocabulary configured, it's rendered with vocabulary tree
 */
@Component({
  selector: 'ds-dynamic-onebox',
  styleUrls: ['./dynamic-onebox.component.scss'],
  templateUrl: './dynamic-onebox.component.html'
})
export class DsDynamicOneboxComponent extends DsDynamicVocabularyComponent implements OnInit {

  @Input() group: UntypedFormGroup;
  @Input() model: DynamicOneboxModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  @ViewChild('instance') instance: NgbTypeahead;

  pageInfo: PageInfo = new PageInfo();
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed$ = new Observable(() => () => this.changeSearchingStatus(false));
  click$ = new Subject<string>();
  currentValue: any;
  previousValue: any;
  inputValue: any;
  preloadLevel: number;
  additionalInfoSelectIsOpen = false;
  alternativeNamesKey = 'alternative-names';
  authorithyIcons = environment.submission.icons.authority.sourceIcons;


  private isHierarchicalVocabulary$: Observable<boolean>;
  private subs: Subscription[] = [];

  constructor(protected vocabularyService: VocabularyService,
              protected cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected modalService: NgbModal,
              protected validationService: DynamicFormValidationService,
              protected formBuilderService: FormBuilderService,
              protected submissionService: SubmissionService
  ) {
    super(vocabularyService, layoutService, validationService, formBuilderService, modalService, submissionService);
  }

  /**
   * Converts an item from the result list to a `string` to display in the `<input>` field.
   */
  formatter = (x: { display: string }) => {
    return (typeof x === 'object') ? x.display : x;
  };

  /**
   * Converts a stream of text values from the `<input>` element to the stream of the array of items
   * to display in the onebox popup.
   */
  search = (text$: Observable<string>) => {
    this.additionalInfoSelectIsOpen = false;
    return text$.pipe(
      merge(this.click$),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.changeSearchingStatus(true)),
      switchMap((term) => {
        if (term === '' || term.length < this.model.minChars) {
          return observableOf({list: []});
        } else {
          return this.vocabularyService.getVocabularyEntriesByValue(
            term,
            false,
            this.model.vocabularyOptions,
            this.pageInfo).pipe(
            getFirstSucceededRemoteDataPayload(),
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return observableOf(buildPaginatedList(
                new PageInfo(),
                []
              ));
            }));
        }
      }),
      map((list: PaginatedList<VocabularyEntry>) => list.page),
      tap(() => this.changeSearchingStatus(false)),
      merge(this.hideSearchingWhenUnsubscribed$)
    );
  };

  /**
   * Initialize the component, setting up the init form value
   */
  ngOnInit() {
    this.initVocabulary();
    this.isHierarchicalVocabulary$ = this.vocabulary$.pipe(
      filter((vocabulary: Vocabulary) => isNotEmpty(vocabulary)),
      map((vocabulary: Vocabulary) => vocabulary.hierarchical),
      tap((isHierarchical: boolean) => {
        if (this.model.value) {
          this.setCurrentValue(this.model.value, isHierarchical);
        }
      })
    );
    this.subs.push(this.group.get(this.model.id).valueChanges.pipe(
      filter((value) => this.currentValue !== value))
      .subscribe((value) => {
        this.setCurrentValue(this.model.value);
      }));
  }

  /**
   * Changes the searching status
   * @param status
   */
  changeSearchingStatus(status: boolean) {
    this.searching = status;
    this.cdr.detectChanges();
  }

  /**
   * Checks if configured vocabulary is Hierarchical or not
   */
  isHierarchicalVocabulary(): Observable<boolean> {
    return this.isHierarchicalVocabulary$;
  }

  /**
   * Update the input value with a FormFieldMetadataValueObject
   * @param event
   */
  onInput(event) {
    if (!this.model.vocabularyOptions.closed && isNotEmpty(event.target.value)) {
      this.inputValue = new FormFieldMetadataValueObject(event.target.value);
      if (this.model.value) {
        if ((this.model.value as any).securityLevel != null) {
          this.inputValue.securityLevel = (this.model.value as any).securityLevel;
        }
      }
    }
  }

  /**
   * Emits a blur event containing a given value.
   * @param event The value to emit.
   */
  onBlur(event: Event) {
    if (!this.instance.isPopupOpen()) {
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
      // set focus on input again, this is to avoid to lose changes when no suggestion is selected
      (event.target as HTMLInputElement).focus();
    }
  }

  /**
   * Updates model value with the current value
   * @param event The change event.
   */
  onChange(event: Event) {
    if (!this.previousValue && !isEmpty(this.currentValue)) {
      if (this.model.securityConfigLevel &&  this.model.securityConfigLevel.length > 0) {
        this.model.securityLevel = this.model.securityConfigLevel[this.model.securityConfigLevel.length - 1];
      }
    }
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
    const item = event.item;

    if ( hasValue(item.otherInformation)) {
      const otherInfoKeys = Object.keys(item.otherInformation).filter((key) => !key.startsWith('data'));
      const hasMultipleValues = otherInfoKeys.some(key => hasValue(item.otherInformation[key]) && item.otherInformation[key].includes('|||'));

      if (hasMultipleValues) {
        this.setMultipleValuesForOtherInfo(otherInfoKeys, item);
      } else {
        this.resetMultipleValuesForOtherInfo();
      }
    } else {
      this.resetMultipleValuesForOtherInfo();
    }

    this.setCurrentValue(item);
    this.dispatchUpdate(item);
  }

  /**
   * Open modal to show tree for hierarchical vocabulary
   * @param event The click event fired
   */
  openTree(event) {
    if (this.model.readOnly) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this.subs.push(this.vocabulary$.pipe(
      map((vocabulary: Vocabulary) => vocabulary.preloadLevel),
      take(1)
    ).subscribe((preloadLevel) => {
      const modalRef: NgbModalRef = this.modalService.open(VocabularyTreeviewModalComponent, {
        size: 'lg',
        windowClass: 'treeview'
      });
      modalRef.componentInstance.vocabularyOptions = this.model.vocabularyOptions;
      modalRef.componentInstance.preloadLevel = preloadLevel;
      modalRef.componentInstance.selectedItems = this.currentValue ? [this.currentValue] : [];
      modalRef.result.then((result: FormFieldMetadataValueObject) => {
        if (result) {
          this.currentValue = result;
          this.previousValue = result;
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
  public whenClickOnConfidenceNotAccepted(confidence: ConfidenceType) {
    if (!this.model.readOnly) {
      this.click$.next(this.formatter(this.currentValue));
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
      this.getInitValueFromModel()
        .subscribe((formValue: FormFieldMetadataValueObject) => {
          this.currentValue = formValue;
          this.previousValue = formValue;
          this.cdr.detectChanges();
        });
    } else {
      if (isEmpty(value)) {
        result = '';
      } else {
        result = value;
      }
      this.currentValue = null;
      this.cdr.detectChanges();

      this.currentValue = result;
      this.previousValue = result;
      this.cdr.detectChanges();
    }
    if (hasValue(this.currentValue?.otherInformation)) {
      const infoKeys = Object.keys(this.currentValue.otherInformation);
      this.setMultipleValuesForOtherInfo(infoKeys, this.currentValue);
    }
  }

  /**
   * Get the other information value removing the authority section (after the last ::)
   * @param itemValue the initial item value
   * @param itemKey
   */
  getOtherInfoValue(itemValue: string, itemKey: string): string {
    if (!itemValue || !itemValue.includes('::')) {
      return itemValue;
    }

    if (itemValue.includes('|||')) {
      let result = '';
      const values = itemValue.split('|||').map(item => item.substring(0, item.lastIndexOf('::')));
      const lastIndex = values.length - 1;
      values.forEach((value, i) => result += i === lastIndex ? value : value + ' · ');
      return result;
    }

    return itemValue.substring(0, itemValue.lastIndexOf('::'));
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  toggleOtherInfoSelection() {
    this.additionalInfoSelectIsOpen = !this.additionalInfoSelectIsOpen;
  }

  selectAlternativeInfo(info: string) {
    this.searching = true;

    if (this.otherInfoKey !== this.alternativeNamesKey) {
      this.otherInfoValue = info;
    } else {
      this.otherName = info;
    }

    const temp = this.createVocabularyObject(info, info, this.currentValue.otherInformation);
    this.currentValue = null;
    this.currentValue = temp;

    const unformattedOtherInfoValue = this.otherInfoValuesUnformatted.find((unformattedItem) => {
      return unformattedItem.startsWith(info);
    });

    if (hasValue(unformattedOtherInfoValue)) {
      const lastIndexOfSeparator = unformattedOtherInfoValue.lastIndexOf('::');
      if (lastIndexOfSeparator !== -1) {
        this.currentValue.authority = unformattedOtherInfoValue.substring(lastIndexOfSeparator + 2);
      } else {
        this.currentValue.authority = undefined;
      }
    }

    const event = {
      item: this.currentValue
    } as any;

    this.onSelectItem(event);
    this.searching = false;
    this.toggleOtherInfoSelection();
  }


  setMultipleValuesForOtherInfo(keys: string[], item: any) {
    const hasAlternativeNames = keys.includes(this.alternativeNamesKey);

    this.otherInfoKey = hasAlternativeNames ? this.alternativeNamesKey : keys.find(key => hasValue(item.otherInformation[key]) && item.otherInformation[key].includes('|||'));
    this.otherInfoValuesUnformatted = item.otherInformation[this.otherInfoKey] ? item.otherInformation[this.otherInfoKey].split('|||') : [];

    this.otherInfoValues = this.otherInfoValuesUnformatted.map(unformattedItem => {
      let lastIndexOfSeparator = unformattedItem.lastIndexOf('::');
      if (lastIndexOfSeparator === -1) {
        lastIndexOfSeparator = undefined;
      }
      return unformattedItem.substring(0, lastIndexOfSeparator);
    });

    if (hasAlternativeNames) {
      this.otherName = hasValue(this.otherName) ? this.otherName : this.otherInfoValues[0];
    }

    if (keys.length > 1) {
      this.otherInfoValue = hasValue(this.otherInfoValue) ? this.otherInfoValue :  this.otherInfoValues[0];
    }
  }

  resetMultipleValuesForOtherInfo() {
    this.otherInfoKey = undefined;
    this.otherInfoValuesUnformatted = [];
    this.otherInfoValues = [];
    this.otherInfoValue = undefined;
    this.otherName = undefined;
  }

  createVocabularyObject(display, value, otherInformation) {
    return Object.assign(new VocabularyEntry(), this.model.value, {
      display: display,
      value: value,
      otherInformation: otherInformation,
      type: 'vocabularyEntry'
    });
  }


  /**
   * Hide image on error
   * @param image
   */
  handleImgError(image: HTMLElement): void {
    image.style.display = 'none';
  }

  /**
   * Get configured icon for each authority source
   * @param source
   */
  getAuthoritySourceIcon(source: string, image: HTMLElement): string {
    if (hasValue(this.authorithyIcons)) {
      const iconPath = this.authorithyIcons.find(icon => icon.source === source)?.path;

      if (!hasValue(iconPath)) {
        this.handleImgError(image);
      }

      return iconPath;
    } else {
      this.handleImgError(image);
    }

    return '';
  }
}
