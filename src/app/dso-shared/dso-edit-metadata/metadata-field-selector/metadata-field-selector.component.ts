import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import {
  SortDirection,
  SortOptions,
} from '../../../core/cache/models/sort-options.model';
import { RegistryService } from '../../../core/registry/registry.service';
import {
  getAllSucceededRemoteData,
  getFirstCompletedRemoteData,
  metadataFieldsToString,
} from '../../../core/shared/operators';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ClickOutsideDirective } from '../../../shared/utils/click-outside.directive';
import { followLink } from '../../../shared/utils/follow-link-config.model';

@Component({
  selector: 'ds-metadata-field-selector',
  styleUrls: ['./metadata-field-selector.component.scss'],
  templateUrl: './metadata-field-selector.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, ReactiveFormsModule, ClickOutsideDirective, NgIf, NgFor, AsyncPipe, TranslateModule],
})
/**
 * Component displaying a searchable input for metadata-fields
 */
export class MetadataFieldSelectorComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Type of the DSpaceObject
   * Used to resolve i18n messages
   */
  @Input() dsoType: string;

  /**
   * The currently entered metadata field
   */
  @Input() mdField: string;

  /**
   * If true, the input will be automatically focussed upon when the component is first loaded
   */
  @Input() autofocus = false;

  /**
   * Emit any changes made to the metadata field
   * This will only emit after a debounce takes place to avoid constant emits when the user is typing
   */
  @Output() mdFieldChange = new EventEmitter<string>();

  /**
   * Reference to the metadata-field's input
   */
  @ViewChild('mdFieldInput', { static: true }) mdFieldInput: ElementRef;

  /**
   * List of available metadata field options to choose from, dependent on the current query the user entered
   * Shows up in a dropdown below the input
   */
  mdFieldOptions$: Observable<string[]>;

  /**
   * FormControl for the input
   */
  public input: UntypedFormControl = new UntypedFormControl();

  /**
   * The current query to update mdFieldOptions$ for
   * This is controlled by a debounce, to avoid too many requests
   */
  query$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * The amount of time to debounce the query for (in ms)
   */
  debounceTime = 300;

  /**
   * Whether or not the the user just selected a value
   * This flag avoids the metadata field from updating twice, which would result in the dropdown opening again right after selecting a value
   */
  selectedValueLoading = false;

  /**
   * Whether or not to show the invalid feedback
   * True when validate() is called and the mdField isn't present in the available metadata fields retrieved from the server
   */
  showInvalid = false;

  /**
   * Subscriptions to unsubscribe from on destroy
   */
  subs: Subscription[] = [];

  constructor(protected registryService: RegistryService,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService) {
  }

  /**
   * Subscribe to any changes made to the input, with a debounce and fire a query, as well as emit the change from this component
   * Update the mdFieldOptions$ depending on the query$ fired by querying the server
   */
  ngOnInit(): void {
    this.subs.push(
      this.input.valueChanges.pipe(
        debounceTime(this.debounceTime),
      ).subscribe((valueChange) => {
        if (!this.selectedValueLoading) {
          this.query$.next(valueChange);
        }
        this.selectedValueLoading = false;
        this.mdField = valueChange;
        this.mdFieldChange.emit(this.mdField);
      }),
    );
    this.mdFieldOptions$ = this.query$.pipe(
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.showInvalid = false;
        if (query !== null) {
          return this.registryService.queryMetadataFields(query, { elementsPerPage: 10, sort: new SortOptions('fieldName', SortDirection.ASC) }, true, false, followLink('schema')).pipe(
            getAllSucceededRemoteData(),
            metadataFieldsToString(),
          );
        } else {
          return [[]];
        }
      }),
    );
  }

  /**
   * Focus the input if autofocus is enabled
   */
  ngAfterViewInit(): void {
    if (this.autofocus) {
      this.mdFieldInput.nativeElement.focus();
    }
  }

  /**
   * Validate the metadata field to check if it exists on the server and return an observable boolean for success/error
   * Upon subscribing to the returned observable, the showInvalid flag is updated accordingly to show the feedback under the input
   */
  validate(): Observable<boolean> {
    return this.registryService.queryMetadataFields(this.mdField, null, true, false, followLink('schema')).pipe(
      getFirstCompletedRemoteData(),
      switchMap((rd) => {
        if (rd.hasSucceeded) {
          return of(rd).pipe(
            metadataFieldsToString(),
            take(1),
            map((fields: string[]) => fields.indexOf(this.mdField) > -1),
            tap((exists: boolean) => this.showInvalid = !exists),
          );
        } else {
          this.notificationsService.error(this.translate.instant(`${this.dsoType}.edit.metadata.metadatafield.error`), rd.errorMessage);
          return [false];
        }
      }),
    );
  }

  /**
   * Select a metadata field from the dropdown options
   * @param mdFieldOption
   */
  select(mdFieldOption: string): void {
    this.selectedValueLoading = true;
    this.input.setValue(mdFieldOption);
  }

  /**
   * Unsubscribe from any open subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub: Subscription) => hasValue(sub)).forEach((sub: Subscription) => sub.unsubscribe());
  }
}
