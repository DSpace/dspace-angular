import { Component, OnInit, Optional } from '@angular/core';
import { hasValue, isEmpty } from '../shared/empty.util';
import { KlaroService } from '../shared/cookies/klaro.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { take } from 'rxjs/operators';
import { Site } from '../core/shared/site.model';
import { SiteDataService } from '../core/data/site-data.service';
import { TextRowSection } from '../core/layout/models/section.model';
import { LocaleService } from '../core/locale/locale.service';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
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

  constructor(
    @Optional() private cookies: KlaroService,
    private authorizationService: AuthorizationDataService,
    private locale: LocaleService,
    private siteService: SiteDataService
  ) {
  }

  ngOnInit() {
    this.showSendFeedback$ = this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);
    this.section = {
      content: 'cris.cms.footer',
      contentType: 'text-metadata',
      componentType: 'text-row',
      style: ''
    };
    this.site = this.siteService.find().pipe(take(1));
    this.siteService.find().pipe(take(1)).subscribe(
      (site: Site) => {
        this.hasSiteFooterSections = !isEmpty(site?.firstMetadataValue('cris.cms.footer',
          { language: this.locale.getCurrentLanguageCode() }));
      }
    );
  }

  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }
}
