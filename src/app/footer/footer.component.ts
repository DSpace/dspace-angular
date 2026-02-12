import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { NotifyInfoService } from '@dspace/core/coar-notify/notify-info/notify-info.service';
import { OrejimeService } from '@dspace/core/cookies/orejime.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  map,
  Observable,
  of,
  take,
} from 'rxjs';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { SiteDataService } from '@dspace/core/data/site-data.service';

@Component({
  selector: 'ds-base-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TranslateModule,
    MarkdownViewerComponent
  ],
})
export class FooterComponent implements OnInit {
  dateObj: number = Date.now();

  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;
  showCookieSettings = false;
  showPrivacyPolicy: boolean;
  showEndUserAgreement: boolean;
  showSendFeedback$: Observable<boolean>;
  coarLdnEnabled$: Observable<boolean>;
  footerMetadataValue$: Observable<string>;

  constructor(
    @Optional() public cookies: OrejimeService,
    protected authorizationService: AuthorizationDataService,
    protected notifyInfoService: NotifyInfoService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private siteService: SiteDataService,
    private locale: LocaleService,
  ) {
  }

  ngOnInit(): void {
    this.showCookieSettings = this.appConfig.info.enableCookieConsentPopup;
    this.showPrivacyPolicy = this.appConfig.info.enablePrivacyStatement;
    this.showEndUserAgreement = this.appConfig.info.enableEndUserAgreement;
    this.coarLdnEnabled$ = this.appConfig.info.enableCOARNotifySupport ? this.notifyInfoService.isCoarConfigEnabled() : of(false);
    this.showSendFeedback$ = this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);

    this.footerMetadataValue$ = combineLatest({
      site$: this.siteService.find().pipe(
        take(1)
      ),
      language$: this.locale.getCurrentLanguageCode(),
    }).pipe(
      take(1),
      map(({ site$, language$ }) => site$?.firstMetadataValue('cris.cms.footer', { language: language$ })),
    );
  }

  openCookieSettings() {
    if (hasValue(this.cookies) && this.cookies.showSettings instanceof Function) {
      this.cookies.showSettings();
    }
    return false;
  }
}
