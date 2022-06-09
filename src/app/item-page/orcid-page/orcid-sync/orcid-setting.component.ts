import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../../../core/auth/auth.service';
import { RemoteData } from '../../../core/data/remote-data';
import { ResearcherProfileService } from '../../../core/profile/researcher-profile.service';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ResearcherProfile } from '../../../core/profile/model/researcher-profile.model';

@Component({
  selector: 'ds-orcid-setting',
  templateUrl: './orcid-setting.component.html',
  styleUrls: ['./orcid-setting.component.scss']
})
export class OrcidSettingComponent implements OnInit {

  /**
   * The item for which showing the orcid settings
   */
  @Input() item: Item;

  messagePrefix = 'person.page.orcid';

  currentSyncMode: string;

  currentSyncPublications: string;

  currentSyncFundings: string;

  syncModes: { value: string, label: string }[];

  syncPublicationOptions: { value: string, label: string }[];

  syncFundingOptions: {value: string, label: string}[];

  syncProfileOptions: { value: string, label: string, checked: boolean }[];


  constructor(private researcherProfileService: ResearcherProfileService,
    protected translateService: TranslateService,
    private notificationsService: NotificationsService,
    public authService: AuthService
  ) {
  }

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

    this.syncFundingOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-fundings.' + value.toLowerCase(),
          value: value,
        };
      });

    const syncProfilePreferences = this.item.allMetadataValues('dspace.orcid.sync-profile');

    this.syncProfileOptions = ['BIOGRAPHICAL', 'IDENTIFIERS']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-profile.' + value.toLowerCase(),
          value: value,
          checked: syncProfilePreferences.includes(value)
        };
      });

    this.currentSyncMode = this.getCurrentPreference('dspace.orcid.sync-mode', ['BATCH', 'MANUAL'], 'MANUAL');
    this.currentSyncPublications = this.getCurrentPreference('dspace.orcid.sync-publications', ['DISABLED', 'ALL'], 'DISABLED');
    this.currentSyncFundings = this.getCurrentPreference('dspace.orcid.sync-fundings', ['DISABLED', 'ALL'], 'DISABLED');
  }

  onSubmit(form: FormGroup) {
    const operations: Operation[] = [];
    this.fillOperationsFor(operations, '/orcid/mode', form.value.syncMode);
    this.fillOperationsFor(operations, '/orcid/publications', form.value.syncPublications);
    this.fillOperationsFor(operations, '/orcid/fundings', form.value.syncFundings);

    const syncProfileValue = this.syncProfileOptions
      .map((syncProfileOption => syncProfileOption.value))
      .filter((value) => form.value['syncProfile_' + value])
      .join(',');

    this.fillOperationsFor(operations, '/orcid/profile', syncProfileValue);

    if (operations.length === 0) {
      return;
    }

    this.researcherProfileService.findByRelatedItem(this.item).pipe(
      getFirstCompletedRemoteData(),
      switchMap((profileRD: RemoteData<ResearcherProfile>) => {
        if (profileRD.hasSucceeded) {
          return this.researcherProfileService.updateByOrcidOperations(profileRD.payload, operations).pipe(
            getFirstCompletedRemoteData()
          );
        } else {
          return of(profileRD);
        }
      }),
    ).subscribe((remoteData: RemoteData<ResearcherProfile>) => {
      if (remoteData.isSuccess) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.synchronization-settings-update.success'));
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.synchronization-settings-update.error'));
      }
    });
  }

  fillOperationsFor(operations: Operation[], path: string, currentValue: string) {
    operations.push({
      path: path,
      op: 'replace',
      value: currentValue
    });
  }

  getCurrentPreference(metadataField: string, allowedValues: string[], defaultValue: string): string {
    const currentPreference = this.item.firstMetadataValue(metadataField);
    return (currentPreference && allowedValues.includes(currentPreference)) ? currentPreference : defaultValue;
  }

}
