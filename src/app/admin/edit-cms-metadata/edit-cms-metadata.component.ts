import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SiteDataService } from '../../core/data/site-data.service';
import { Site } from '../../core/shared/site.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { BehaviorSubject } from 'rxjs';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

/**
 * Component representing the page to edit cms metadata for site.
 */
@Component({
  selector: 'ds-edit-homepage-metadata',
  templateUrl: './edit-cms-metadata.component.html',
  styleUrls: ['./edit-cms-metadata.component.scss']
})
export class EditCmsMetadataComponent implements OnInit {
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

  back() {
    this.selectedMetadata = undefined;
    this.editMode.next(false);
  }

  languageLabel(key: string) {
    return this.languageMap.get(key) ?? key;
  }

  editSelectedMetadata() {
    if (this.selectedMetadata) {
      this.languageList.forEach((languageCode: string) => {
        const text = this.site.firstMetadataValue(this.selectedMetadata, { language: languageCode });
        this.selectedMetadataValues.set(languageCode, text);
      });
    }
    this.editMode.next(true);
  }

  private getOperationsToEditText(): Operation[] {
    const firstLanguage = this.selectedMetadataValues.keys().next().value;
    const operations = [];
    operations.push({
      op: 'replace',
      path: '/metadata/' + this.selectedMetadata,
      value: {
        value: this.selectedMetadataValues.get(firstLanguage) ?? '',
        language: firstLanguage
      }
    });
    this.selectedMetadataValues.forEach((value, key) => {
      if (key !== firstLanguage) {
        operations.push({
          op: 'add',
          path: '/metadata/' + this.selectedMetadata,
          value: {
            value: value ?? '',
            language: key
          }
        });
      }
    });
    return operations;
  }
}

