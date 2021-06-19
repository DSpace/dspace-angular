import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { switchMap } from 'rxjs/operators';
import { ResearcherProfileService } from '../../../core/profile/researcher-profile.service';
import { AuthService } from '../../../core/auth/auth.service';
import { getFinishedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';

@Component({
  selector: 'ds-orcid-sync-settings.component',
  templateUrl: './orcid-sync-settings.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.ORCID, LayoutBox.ORCID_SYNC_SETTINGS)
export class OrcidSyncSettingsComponent extends CrisLayoutBoxObj implements OnInit {

  messagePrefix = 'person.page.orcid';

  currentSyncMode: string;

  currentSyncPublications: string;

  currentSyncFundings: string;

  syncModes: { value: string, label: string }[];

  syncPublicationOptions: { value: string, label: string }[];

  syncFundingOptions: {value: string, label: string}[];

  syncProfileOptions: { value: string, label: string, checked: boolean }[];

  /**
   * Variable to understand if the next box clear value
   */
  nextBoxClear = true;

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.flex') flex = '0 0 100%';

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.marginRight') margin = '0px';


  constructor(private researcherProfileService: ResearcherProfileService,
              protected translateService: TranslateService,
              private notificationsService: NotificationsService,
              public authService: AuthService) {
    super(translateService);
  }

  ngOnInit() {
    super.ngOnInit();
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

    // this.syncPublicationOptions = ['DISABLED', 'ALL', 'MY_SELECTED', 'MINE']
    this.syncPublicationOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-publications.' + value.toLowerCase(),
          value: value,
        };
      });

    // this.syncPublicationOptions = ['DISABLED', 'ALL', 'MY_SELECTED', 'MINE']
    this.syncFundingOptions = ['DISABLED', 'ALL']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-fundings.' + value.toLowerCase(),
          value: value,
        };
      });

    const syncProfilePreferences = this.item.allMetadataValues('cris.orcid.sync-profile');

    this.syncProfileOptions = ['AFFILIATION', 'EDUCATION', 'BIOGRAPHICAL', 'IDENTIFIERS']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-profile.' + value.toLowerCase(),
          value: value,
          checked: syncProfilePreferences.includes(value)
        };
      });

    this.currentSyncMode = this.getCurrentPreference('cris.orcid.sync-mode', ['BATCH, MANUAL'], 'MANUAL');
    this.currentSyncPublications = this.getCurrentPreference('cris.orcid.sync-publications', ['DISABLED', 'ALL'], 'DISABLED');
    this.currentSyncFundings = this.getCurrentPreference('cris.orcid.sync-fundings', ['DISABLED', 'ALL'], 'DISABLED');
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

    this.researcherProfileService.findById(this.item.firstMetadata('cris.owner').authority).pipe(
      switchMap((profile) => this.researcherProfileService.patch(profile, operations)),
      getFinishedRemoteData()
    ).subscribe((remoteData) => {
      if (remoteData.isSuccess) {
        this.refreshTab.emit();
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
