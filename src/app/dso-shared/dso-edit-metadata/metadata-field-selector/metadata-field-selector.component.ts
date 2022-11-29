import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import {
  getAllSucceededRemoteData,
  getFirstSucceededRemoteData,
  metadataFieldsToString
} from '../../../core/shared/operators';
import { Observable } from 'rxjs/internal/Observable';
import { RegistryService } from '../../../core/registry/registry.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { hasValue } from '../../../shared/empty.util';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'ds-metadata-field-selector',
  styleUrls: ['./metadata-field-selector.component.scss'],
  templateUrl: './metadata-field-selector.component.html'
})
export class MetadataFieldSelectorComponent implements OnInit, OnDestroy {
  @Input() mdField: string;
  @Output() mdFieldChange = new EventEmitter<string>();
  mdFieldOptions$: Observable<string[]>;

  public input: FormControl = new FormControl();

  query$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  debounceTime = 500;

  subs: Subscription[] = [];

  constructor(protected registryService: RegistryService) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.input.valueChanges.pipe(
        debounceTime(this.debounceTime),
      ).subscribe((valueChange) => {
        this.query$.next(valueChange);
        this.mdField = valueChange;
        this.mdFieldChange.emit(this.mdField);
      }),
    );
    this.mdFieldOptions$ = this.query$.pipe(
      distinctUntilChanged(),
      switchMap((query) => {
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

  select(mdFieldOption: string) {
    this.mdField = mdFieldOption;
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
