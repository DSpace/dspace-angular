import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of as observableOf } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';
import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../../../../../core/integration/integration-data';

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

  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityOptions.scope,
      this.model.authorityOptions.name,
      this.model.authorityOptions.metadata,
      '',
      this.model.maxOptions,
      1);
    this.authorityService.getEntriesByName(this.searchOptions).pipe(
      catchError(() => {
        const emptyResult = new IntegrationData(
          new PageInfo(),
          []
        );
        return observableOf(emptyResult);
      }),
      first())
      .subscribe((object: IntegrationData) => {
        this.optionsList = object.payload;
        if (this.model.value) {
          this.setCurrentValue(this.model.value);
        }
        this.pageInfo = object.pageInfo;
        this.cdr.detectChanges();
      })
  }

  inputFormatter = (x: AuthorityValue): string => x.display || x.value;

  openDropdown(sdRef: NgbDropdown) {
    if (!this.model.readOnly) {
      sdRef.open();
    }
  }

  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.loading = true;
      this.searchOptions.currentPage++;
      this.authorityService.getEntriesByName(this.searchOptions).pipe(
        catchError(() => {
          const emptyResult = new IntegrationData(
            new PageInfo(),
            []
          );
          return observableOf(emptyResult);
        }),
        tap(() => this.loading = false))
        .subscribe((object: IntegrationData) => {
          this.optionsList = this.optionsList.concat(object.payload);
          this.pageInfo = object.pageInfo;
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
