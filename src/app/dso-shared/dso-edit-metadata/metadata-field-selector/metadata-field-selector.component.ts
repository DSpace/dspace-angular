import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { switchMap, debounceTime, distinctUntilChanged, map, tap, take } from 'rxjs/operators';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import {
  getAllSucceededRemoteData, getFirstCompletedRemoteData, getFirstSucceededRemoteData,
  metadataFieldsToString
} from '../../../core/shared/operators';
import { Observable } from 'rxjs/internal/Observable';
import { RegistryService } from '../../../core/registry/registry.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'ds-metadata-field-selector',
  styleUrls: ['./metadata-field-selector.component.scss'],
  templateUrl: './metadata-field-selector.component.html'
})
export class MetadataFieldSelectorComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() mdField: string;
  @Input() autofocus = false;
  @Output() mdFieldChange = new EventEmitter<string>();
  @ViewChild('mdFieldInput', { static: true }) mdFieldInput: ElementRef;
  mdFieldOptions$: Observable<string[]>;

  public input: FormControl = new FormControl();

  query$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  debounceTime = 300;
  selectedValueLoading = false;
  showInvalid = false;

  subs: Subscription[] = [];

  constructor(protected registryService: RegistryService) {
  }

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
      switchMap((query) => {
        this.showInvalid = false;
        if (query !== null) {
          return this.registryService.queryMetadataFields(query, null, true, false, followLink('schema')).pipe(
            getAllSucceededRemoteData(),
            metadataFieldsToString(),
          );
        } else {
          return [[]];
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    this.mdFieldInput.nativeElement.focus();
  }

  validate(): Observable<boolean> {
    return this.registryService.queryMetadataFields(this.mdField, null, true, false, followLink('schema')).pipe(
      getFirstSucceededRemoteData(),
      metadataFieldsToString(),
      take(1),
      map((fields: string[]) => fields.indexOf(this.mdField) > -1),
      tap((exists) => this.showInvalid = !exists),
    );
  }

  select(mdFieldOption: string) {
    this.selectedValueLoading = true;
    this.input.setValue(mdFieldOption);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
