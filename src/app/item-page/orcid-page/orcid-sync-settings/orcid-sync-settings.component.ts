import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { ResearcherProfileDataService } from '../../../core/profile/researcher-profile-data.service';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ResearcherProfile } from '../../../core/profile/model/researcher-profile.model';
import { hasValue } from '../../../shared/empty.util';
import { HttpErrorResponse } from '@angular/common/http';
import { createFailedRemoteDataObject } from '../../../shared/remote-data.utils';

@Component({
  selector: 'ds-orcid-sync-setting',
  templateUrl: './orcid-sync-settings.component.html',
  styleUrls: ['./orcid-sync-settings.component.scss']
})
export class OrcidSyncSettingsComponent implements OnInit, OnDestroy {

  /**
   * The prefix used for i18n keys
   */
  messagePrefix = 'person.page.orcid';
  /**
   * The current synchronization mode
   */
  currentSyncMode: string;

  /**
   * The current synchronization mode for patents
   */
  currentSyncPatent: string;

  /**
   * The current synchronization mode for publications
   */
  currentSyncPublications: string;

  /**
   * The current synchronization mode for product
   */
  currentSyncProduct: string;

  /**
   * The current synchronization mode for funding
   */
  currentSyncFunding: string;
  /**
   * The synchronization options
   */
  syncModes: { value: string, label: string }[];

  /**
   * The synchronization options for patents
   */
  syncPatentOptions: { value: string, label: string }[];

  /**
   * The synchronization options for publications
   */
  syncPublicationOptions: { value: string, label: string }[];

  /**
   * The synchronization options for products
   */
  syncProductOptions: { value: string, label: string }[];

  /**
   * The synchronization options for funding
   */
  syncFundingOptions: { value: string, label: string }[];
  /**
   * The profile synchronization options
   */
  syncProfileOptions: { value: string, label: string, checked: boolean }[];
  /**
   * An event emitted when settings are updated
   */
  @Output() settingsUpdated: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Emitter that triggers onDestroy lifecycle
   * @private
   */
  readonly #destroy$ = new EventEmitter<void>();
  /**
   * {@link BehaviorSubject} that reflects {@link item} input changes
   * @private
   */
  readonly #item$ = new BehaviorSubject<Item>(null);
  /**
   * {@link Observable} that contains {@link ResearcherProfile} linked to the {@link #item$}
   * @private
   */
  #researcherProfile$: Observable<ResearcherProfile>;

  constructor(private researcherProfileService: ResearcherProfileDataService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService) {
  }

  /**
   * The item for which showing the orcid settings
   */
  @Input()
  set item(item: Item) {
    this.#item$.next(item);
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
  }

  /**
   * Init orcid settings form
   */
  ngOnInit() {
    this.syncModes = [
      {
        label: this.messagePrefix + '.synchronization-mode.batch',
        value: 'BATCH'
      },
      {
        label: this.messagePrefix + '.synchronization-mode.manual',
        value: 'MANUAL'
      }
    ];

    this.syncPublicationOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-publications.' + value.toLowerCase(),
          value: value,
        };
      });

    this.syncProductOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-products.' + value.toLowerCase(),
          value: value,
        };
      });

    this.syncPatentOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-patents.' + value.toLowerCase(),
          value: value,
        };
      });

    this.syncFundingOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-fundings.' + value.toLowerCase(),
          value: value,
        };
      });

    this.updateSyncProfileOptions(this.#item$.asObservable());
    this.updateSyncPreferences(this.#item$.asObservable());

    this.#researcherProfile$ =
      this.#item$.pipe(
        switchMap(item =>
          this.researcherProfileService.findByRelatedItem(item)
            .pipe(
              getFirstCompletedRemoteData(),
              catchError((err: HttpErrorResponse) => of(createFailedRemoteDataObject<ResearcherProfile>(err.message, err.status))),
              getRemoteDataPayload(),
            )
        ),
        takeUntil(this.#destroy$)
      );
  }

  /**
   * Generate path operations to save orcid synchronization preferences
   *
   * @param form The form group
   */
  onSubmit(form: UntypedFormGroup): void {
    const operations: Operation[] = [];
    this.fillOperationsFor(operations, '/orcid/mode', form.value.syncMode);
    this.fillOperationsFor(operations, '/orcid/patents', form.value.syncPatents);
    this.fillOperationsFor(operations, '/orcid/publications', form.value.syncPublications);
    this.fillOperationsFor(operations, '/orcid/products', form.value.syncProducts);
    this.fillOperationsFor(operations, '/orcid/fundings', form.value.syncFundings);

    const syncProfileValue = this.syncProfileOptions
      .map((syncProfileOption => syncProfileOption.value))
      .filter((value) => form.value['syncProfile_' + value])
      .join(',');

    this.fillOperationsFor(operations, '/orcid/profile', syncProfileValue);

    if (operations.length === 0) {
      return;
    }

    this.#researcherProfile$
      .pipe(
        switchMap(researcherProfile => this.researcherProfileService.patch(researcherProfile, operations)),
        getFirstCompletedRemoteData(),
        catchError((err: HttpErrorResponse) => of(createFailedRemoteDataObject(err.message, err.status))),
        take(1)
      )
      .subscribe((remoteData: RemoteData<ResearcherProfile>) => {
        // hasSucceeded is true if the response is success or successStale
        if (remoteData.hasSucceeded) {
          this.notificationsService.success(this.translateService.get(this.messagePrefix + '.synchronization-settings-update.success'));
          this.settingsUpdated.emit();
        } else {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + '.synchronization-settings-update.error'));
        }
      });
  }

  /**
   *
   * Handles subscriptions to populate sync preferences
   *
   * @param item observable that emits update on item changes
   * @private
   */
  private updateSyncPreferences(item: Observable<Item>) {
    item.pipe(
      filter(hasValue),
      map(i => this.getCurrentPreference(i, 'dspace.orcid.sync-mode', ['BATCH', 'MANUAL'], 'MANUAL')),
      takeUntil(this.#destroy$)
    ).subscribe(val => this.currentSyncMode = val);
    item.pipe(
      filter(hasValue),
      map(i => this.getCurrentPreference(i, 'dspace.orcid.sync-publications', ['DISABLED', 'ALL'], 'DISABLED')),
      takeUntil(this.#destroy$)
    ).subscribe(val => this.currentSyncPublications = val);
    item.pipe(
      filter(hasValue),
      map(i => this.getCurrentPreference(i, 'dspace.orcid.sync-fundings', ['DISABLED', 'ALL'], 'DISABLED')),
      takeUntil(this.#destroy$)
    ).subscribe(val => this.currentSyncFunding = val);
    item.pipe(
      filter(hasValue),
      map(i => this.getCurrentPreference(i, 'dspace.orcid.sync-patents', ['DISABLED', 'ALL'], 'DISABLED')),
      takeUntil(this.#destroy$),
    ).subscribe(val => this.currentSyncPatent = val);
    item.pipe(
      filter(hasValue),
      map(i => this.getCurrentPreference(i, 'dspace.orcid.sync-products', ['DISABLED', 'ALL'], 'DISABLED')),
      takeUntil(this.#destroy$),
    ).subscribe(val => this.currentSyncProduct = val);
  }

  /**
   * Handles subscription to populate the {@link syncProfileOptions} field
   *
   * @param item observable that emits update on item changes
   * @private
   */
  private updateSyncProfileOptions(item: Observable<Item>) {
    item.pipe(
      filter(hasValue),
      map(i => i.allMetadataValues('dspace.orcid.sync-profile')),
      map(metadata =>
        ['BIOGRAPHICAL', 'IDENTIFIERS']
          .map((value) => {
            return {
              label: this.messagePrefix + '.sync-profile.' + value.toLowerCase(),
              value: value,
              checked: metadata.includes(value)
            };
          })
      ),
      takeUntil(this.#destroy$)
    )
      .subscribe(value => this.syncProfileOptions = value);
  }

  /**
   * Retrieve setting saved in the item's metadata
   *
   * @param item The item from which retrieve settings
   * @param metadataField The metadata name that contains setting
   * @param allowedValues The allowed values
   * @param defaultValue  The default value
   * @private
   */
  private getCurrentPreference(item: Item, metadataField: string, allowedValues: string[], defaultValue: string): string {
    const currentPreference = item.firstMetadataValue(metadataField);
    return (currentPreference && allowedValues.includes(currentPreference)) ? currentPreference : defaultValue;
  }

  /**
   * Generate a replace patch operation
   *
   * @param operations
   * @param path
   * @param currentValue
   */
  private fillOperationsFor(operations: Operation[], path: string, currentValue: string): void {
    operations.push({
      path: path,
      op: 'replace',
      value: currentValue
    });
  }

}
