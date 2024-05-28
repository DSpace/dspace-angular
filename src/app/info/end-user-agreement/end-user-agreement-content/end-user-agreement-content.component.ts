import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SiteDataService } from '../../../core/data/site-data.service';
import { LocaleService } from '../../../core/locale/locale.service';
import { MetadatumViewModel } from '../../../core/shared/metadata.models';
import { isNotEmpty } from '../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-end-user-agreement-content',
  templateUrl: './end-user-agreement-content.component.html',
  styleUrls: ['./end-user-agreement-content.component.scss']
})
/**
 * Component displaying the contents of the End User Agreement
 */
export class EndUserAgreementContentComponent implements OnInit, OnDestroy {

  USER_AGREEMENT_TEXT_METADATA = 'dc.rights';

  subs: Subscription[] = [];

  userAgreementText$: BehaviorSubject<string> = new BehaviorSubject('');

  fallbackText = 'info.end-user-agreement.content.fallback';

  constructor(private siteService: SiteDataService,
              private localeService: LocaleService,
              private translateService: TranslateService
            ) {
  }

  private filterMetadata(metadata: MetadatumViewModel, langCode: string) {
    return metadata.key === this.USER_AGREEMENT_TEXT_METADATA && metadata.language === langCode && isNotEmpty(metadata.value);
  }

  ngOnInit(): void {
    this.subs.push(this.siteService.find().subscribe((site) => {
      const langCode = this.localeService.getCurrentLanguageCode();
      const fallbackLangCode = 'en';

      const textArray = site?.metadataAsList.filter((metadata) => this.filterMetadata(metadata, langCode));
      const fallbackTextArray = site?.metadataAsList.filter((metadata) => this.filterMetadata(metadata, fallbackLangCode));
      const defaultFallbackText = this.translateService.instant(this.fallbackText);

      this.userAgreementText$.next(textArray[0]?.value || fallbackTextArray[0]?.value || defaultFallbackText);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.userAgreementText$.unsubscribe();
  }

}
