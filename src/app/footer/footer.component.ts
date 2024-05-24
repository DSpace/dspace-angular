import {
  Component,
  OnInit,
  Optional,
} from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
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

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html',
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

  showPrivacyPolicy = environment.info.enablePrivacyStatement;
  showEndUserAgreement = environment.info.enableEndUserAgreement;
  showSendFeedback$: Observable<boolean>;
  coarLdnEnabled: boolean;

  constructor(
    @Optional() private cookies: KlaroService,
    private authorizationService: AuthorizationDataService,
    private notifyInfoService: NotifyInfoService,
    private locale: LocaleService,
    private siteService: SiteDataService,
  ) {
  }

  ngOnInit() {
    this.showSendFeedback$ = this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);
    this.notifyInfoService.isCoarConfigEnabled().subscribe(coarLdnEnabled => {
      this.coarLdnEnabled = coarLdnEnabled;
    });
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

  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }
}
