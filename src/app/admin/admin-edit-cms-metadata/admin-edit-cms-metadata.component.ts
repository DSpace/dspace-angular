import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { BehaviorSubject } from 'rxjs';
import { BtnDisabledDirective } from 'src/app/shared/btn-disabled.directive';

import { environment } from '../../../environments/environment';
import { SiteDataService } from '../../core/data/site-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Site } from '../../core/shared/site.model';

/**
 * Component representing the page to edit cms metadata for site.
 */
@Component({
  selector: 'ds-edit-homepage-metadata',
  templateUrl: './admin-edit-cms-metadata.component.html',
  styleUrls: ['./admin-edit-cms-metadata.component.scss'],
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormsModule,
    NgTemplateOutlet,
    TranslateModule,
  ],
})
export class AdminEditCmsMetadataComponent implements OnInit {
  /**
   * default value of the select options
   */
  selectedMetadata: string;
  /**
   * default true to show the select options
   */
  editMode: BehaviorSubject<boolean> = new BehaviorSubject(false);
  /**
   * The map between language codes available and their label
   */
  languageMap: Map<string, string> = new Map();
  /**
   * The list of languages available
   */
  languageList: string[] = [];
  /**
   * key value pair map with language and value of metadata
   */
  selectedMetadataValues: Map<string, string> = new Map();
  /**
   * the owner object of the metadataList
   */
  site: Site;
  /**
   * list of the metadata to be edited by the user
   */
  metadataList: string[] = [];

  constructor(
    private siteService: SiteDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    environment.languages.filter((language) => language.active).forEach((language) => {
      this.languageMap.set(language.code, language.label);
      this.languageList.push(language.code);
    });
    environment.cms.metadataList.forEach((md) => {
      this.metadataList.push(md);
    });
    this.siteService.find().subscribe((site) => {
      this.site = site;
    });
  }

  /**
   * Save metadata values
   */
  saveMetadata() {
    const operations = this.getOperationsToEditText();

    this.siteService.patch(this.site, operations).pipe(getFirstCompletedRemoteData())
      .subscribe((restResponse) => {
        if (restResponse.hasSucceeded) {
          this.site = restResponse.payload;
          this.notificationsService.success(this.translateService.get('admin.edit-cms-metadata.success'));
          this.selectedMetadata = undefined;
          this.editMode.next(false);
        } else {
          this.notificationsService.error(this.translateService.get('admin.edit-cms-metadata.error'));
        }
        this.siteService.setStale();
        this.siteService.find().subscribe((site) => {
          this.site = site;
        });
      });
  }

  /**
   * Reset metadata selection and go back to the select options
   */
  back() {
    this.selectedMetadata = undefined;
    this.editMode.next(false);
  }

  /**
   * Get the label for a language key using language map
   * @param key Key of the language to get the label for
   * @returns Label of the language if found, otherwise the key itself
   */
  languageLabel(key: string) {
    return this.languageMap.get(key) ?? key;
  }

  /**
   * Start editing selected metadata
   */
  editSelectedMetadata() {
    if (this.selectedMetadata) {
      this.languageList.forEach((languageCode: string) => {
        const text = this.site.firstMetadataValue(this.selectedMetadata, { language: languageCode });
        this.selectedMetadataValues.set(languageCode, text);
      });
    }
    this.editMode.next(true);
  }

  /**
   * Create a list of operations to send to backend to edit selected metadata
   * @returns List of operations to send to backend to edit selected metadata
   */
  private getOperationsToEditText(): Operation[] {
    const entries = Array.from(this.selectedMetadataValues.entries());

    // First entry should form a 'replace' operation, then the rest should be an 'add' operation
    return entries.map(([language, text], index) => ({
      op: index === 0 ? 'replace' : 'add',
      path: `/metadata/${this.selectedMetadata}`,
      value: {
        value: text ?? '',
        language: language,
      },
    }));
  }
}
