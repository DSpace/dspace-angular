import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { switchMap, tap } from 'rxjs/operators';
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

  currentSyncProjects: string;

  syncModes: {value: string, label: string}[];

  syncPublicationOptions: {value: string, label: string}[];

  syncProjectOptions: {value: string, label: string}[];

  syncProfileOptions: {value: string, label: string, checked: boolean}[];

  constructor(private researcherProfileService: ResearcherProfileService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              public authService: AuthService) {
    super();
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

    this.syncPublicationOptions = [
      {
        label: this.messagePrefix + '.sync-publications.disabled',
        value: 'DISABLED'
      },
      {
        label: this.messagePrefix + '.sync-publications.all',
        value: 'ALL'
      },
      {
        label: this.messagePrefix + '.sync-publications.my-selected',
        value: 'MY_SELECTED'
      },
      {
        label: this.messagePrefix + '.sync-publications.mine',
        value: 'MINE'
      }
    ];

    this.syncProjectOptions = [
      {
        label: this.messagePrefix + '.sync-projects.disabled',
        value: 'DISABLED'
      },
      {
        label: this.messagePrefix + '.sync-projects.all',
        value: 'ALL'
      },
      {
        label: this.messagePrefix + '.sync-projects.my-selected',
        value: 'MY_SELECTED'
      },
      {
        label: this.messagePrefix + '.sync-projects.mine',
        value: 'MINE'
      }
    ];

    const syncProfilePreferences = this.item.allMetadataValues('cris.orcid.sync-profile');

    this.syncProfileOptions = ['AFFILIATION', 'EDUCATION', 'BIOGRAPHICAL', 'IDENTIFIERS']
      .map((value) => {
        return {
          label: this.messagePrefix + '.sync-profile.' + value.toLocaleLowerCase(),
          value: value,
          checked: syncProfilePreferences.includes(value)
        };
      });

    this.currentSyncMode = this.item.hasMetadata('cris.orcid.sync-mode') ? this.item.firstMetadataValue('cris.orcid.sync-mode') : 'MANUAL';
    this.currentSyncPublications = this.item.hasMetadata('cris.orcid.sync-publications') ? this.item.firstMetadataValue('cris.orcid.sync-publications') : 'DISABLED';
    this.currentSyncProjects = this.item.hasMetadata('cris.orcid.sync-projects') ? this.item.firstMetadataValue('cris.orcid.sync-projects') : 'DISABLED';
  }

  onSubmit(form: FormGroup) {
    const operations: Operation[] = [];
    this.fillOperationsFor(operations, '/orcid/mode', form.value.syncMode);
    this.fillOperationsFor(operations, '/orcid/publications', form.value.syncPublications);
    this.fillOperationsFor(operations, '/orcid/projects', form.value.syncProjects);

    const syncProfileValue = this.syncProfileOptions
      .map((syncProfileOption => syncProfileOption.value))
      .filter((value) => form.value['syncProfile_' + value])
      .join(',');

    this.fillOperationsFor(operations, '/orcid/profile', syncProfileValue);

    if (operations.length === 0 ) {
      return;
    }

    this.researcherProfileService.findById(this.item.firstMetadata('cris.owner').authority).pipe(
      switchMap((profile) => this.researcherProfileService.patch(profile, operations)),
      getFinishedRemoteData()
    ).subscribe((remoteData) => {
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

}
