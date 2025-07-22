import {
  AsyncPipe,
  DatePipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import { take } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../config/app-config.interface';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { SiteDataService } from '../core/data/site-data.service';
import { TextRowSection } from '../core/layout/models/section.model';
import { LocaleService } from '../core/locale/locale.service';
import { Site } from '../core/shared/site.model';
import { KlaroService } from '../shared/cookies/klaro.service';
import {
  hasValue,
  isEmpty,
} from '../shared/empty.util';
import { ThemedTextSectionComponent } from '../shared/explore/section-component/text-section/themed-text-section.component';

@Component({
  selector: 'ds-base-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, DatePipe, TranslateModule, ThemedTextSectionComponent],
})
export class FooterComponent implements OnInit {
  dateObj: number = Date.now();
  /**
   * A boolean representing if there are site footer sections to show
   */
  hasSiteFooterSections: boolean;
  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = true;
  /**
   * Represents the site to show the footer metadata
   */
  site: Observable<Site>;
  /**
   * The section data to be rendered as footer
   */
  section: TextRowSection;

  showCookieSettings = false;
  showPrivacyPolicy: boolean;
  showEndUserAgreement: boolean;
  showSendFeedback$: Observable<boolean>;
  coarLdnEnabled$: Observable<boolean>;

  constructor(
    @Optional() public cookies: KlaroService,
    protected authorizationService: AuthorizationDataService,
    protected notifyInfoService: NotifyInfoService,
    private locale: LocaleService,
    private siteService: SiteDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
  }

  ngOnInit(): void {
    this.showCookieSettings = this.appConfig.info.enableCookieConsentPopup;
    this.showPrivacyPolicy = this.appConfig.info.enablePrivacyStatement;
    this.showEndUserAgreement = this.appConfig.info.enableEndUserAgreement;
    this.coarLdnEnabled$ = this.appConfig.info.enableCOARNotifySupport ? this.notifyInfoService.isCoarConfigEnabled() : observableOf(false);
    this.showSendFeedback$ = this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);

    this.section = {
      content: 'cris.cms.footer',
      contentType: 'text-metadata',
      componentType: 'text-row',
      style: '',
    };
    this.site = this.siteService.find().pipe(take(1));
    this.siteService.find().pipe(take(1)).subscribe(
      (site: Site) => {
        this.hasSiteFooterSections = !isEmpty(site?.firstMetadataValue('cris.cms.footer',
          { language: this.locale.getCurrentLanguageCode() }));
      },
    );
  }

  openCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }
}
