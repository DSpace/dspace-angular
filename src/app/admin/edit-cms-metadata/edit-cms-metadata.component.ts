import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {SiteDataService} from '../../core/data/site-data.service';
import {Site} from '../../core/shared/site.model';
import {NotificationsService} from '../../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';
import {Operation} from 'fast-json-patch';

interface HomePageMetadata {
  languageLabel: string;
  text: string;
}

@Component({
  selector: 'ds-edit-homepage-metadata',
  templateUrl: './edit-cms-metadata.component.html',
  styleUrls: ['./edit-cms-metadata.component.scss']
})
export class EditCmsMetadataComponent implements OnInit {
  metadataSelectedTobeEdited = '0';
  selectMode = true;
  languages: object[] = [];
  metadataValueHomePage: Map<string, HomePageMetadata> = new Map();
  site: Site;
  metadataList: string[] = [];
  // tslint:disable-next-line:no-empty
  constructor(private siteService: SiteDataService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    environment.cms.metadataList.forEach((md) => {
      this.metadataList.push(md);
    });
    environment.languages.filter((language) => language.active)
      .forEach((language) => {
        this.metadataValueHomePage.set(language.code, {
          languageLabel: language.label,
          text: ''
        });
      });
    this.siteService.find().subscribe((site) => {
      this.site = site;
    });
  }

  /**
   * edit the metadata
   * @param content the modal content
   */
  edit() {
    const operations = this.getOperationsToEditText();
    this.siteService.patch(this.site, operations).subscribe((restResponse) => {
      if (restResponse.isSuccess) {
        this.site = restResponse.payload;
        this.notificationsService.success(this.translateService.get('admin.edit-cms-metadata.success'));
      } else {
        if (restResponse.isError) {
          this.notificationsService.error(this.translateService.get('admin.edit-cms-metadata.error'));
        }
      }
    });
  }

  private getOperationsToEditText(): Operation[] {
    const firstLanguage = this.metadataValueHomePage.keys().next().value;
    const operations = [];
    operations.push({
      op: 'replace',
      path: '/metadata/' + this.metadataSelectedTobeEdited,
      value: {
        value: this.metadataValueHomePage.get(firstLanguage).text,
        language: firstLanguage
      }
    });
    this.metadataValueHomePage.forEach((value, key) => {
      if (key !== firstLanguage) {
        operations.push({
          op: 'add',
          path: '/metadata/' + this.metadataSelectedTobeEdited,
          value: {
            value: value.text,
            language: key
          }
        });
      }
    });
    return operations;
  }

  selectMetadataToEdit() {
    if (this.metadataSelectedTobeEdited !== '0') {
      this.selectMode = false;
    }
  }
}

