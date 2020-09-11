import { Component, OnInit } from '@angular/core';
import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { LayoutBox } from '../../enums/layout-box.enum';
import { NgForm, FormGroup } from '@angular/forms';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { Operation } from 'fast-json-patch';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RequestService } from 'src/app/core/data/request.service';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';

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

  currentSyncProfile: string[];

  syncModes: Array<{value: string, label: string}>;

  syncPublicationOptions: Array<{value: string, label: string}>;

  syncProjectOptions: Array<{value: string, label: string}>;

  syncProfileOptions: Array<{value: string, label: string, checked: boolean}>;

  constructor(private itemDataService: ItemDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private requestService: RequestService,
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

    this.syncProfileOptions = [
      {
        label: this.messagePrefix + '.sync-profile.affiliation',
        value: 'AFFILIATION',
        checked: true
      },
      {
        label: this.messagePrefix + '.sync-profile.education',
        value: 'EDUCATION',
        checked: true
      },
      {
        label: this.messagePrefix + '.sync-profile.bibliographic',
        value: 'BIBLIOGRAPHIC',
        checked: true
      },
      {
        label: this.messagePrefix + '.sync-profile.identifiers',
        value: 'IDENTIFIERS',
        checked: true
      }
    ];

    this.currentSyncMode = this.item.hasMetadata('cris.orcid.sync-mode') ? this.item.firstMetadataValue('cris.orcid.sync-mode') : 'MANUAL';
    this.currentSyncPublications = this.item.hasMetadata('cris.orcid.sync-publications') ? this.item.firstMetadataValue('cris.orcid.sync-publications') : 'DISABLED';
    this.currentSyncProjects = this.item.hasMetadata('cris.orcid.sync-projects') ? this.item.firstMetadataValue('cris.orcid.sync-projects') : 'DISABLED';
    this.currentSyncProfile = [];
  }

  onSubmit(form: FormGroup) {
    const operations: Operation[] = [];
    this.fillOperationsFor(operations, 'cris.orcid.sync-mode', form.value.syncMode);
    this.fillOperationsFor(operations, 'cris.orcid.sync-publications', form.value.syncPublications);
    this.fillOperationsFor(operations, 'cris.orcid.sync-projects', form.value.syncProjects);

    if (operations.length === 0 ) {
      return;
    }

    this.itemDataService.patch(this.item, operations)
      .subscribe((restResponse) => {
        if (restResponse.isSuccessful) {
          this.notificationsService.success(this.translateService.get(this.messagePrefix + '.synchronization-settings-update.success'));
          this.requestService.removeByHrefSubstring(this.item._links.self.href);
          this.itemDataService.findById(this.item.id)
            .pipe(getFirstSucceededRemoteDataPayload())
            .subscribe((item) => this.item = item);
        } else {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + '.synchronization-settings-update.error'));
        }
      });
  }

  fillOperationsFor(operations: Operation[], metadataField: string, currentValue: string) {
    if (this.item.hasMetadata(metadataField) && this.item.firstMetadataValue(metadataField) === currentValue) {
      return;
    }

    operations.push({
      path: '/metadata/' + metadataField,
      op: !this.item.hasMetadata(metadataField) ? 'add' : 'replace',
      value: currentValue
    })
  }
}
