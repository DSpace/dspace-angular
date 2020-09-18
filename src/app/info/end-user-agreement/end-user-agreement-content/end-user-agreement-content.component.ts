import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SiteDataService } from 'src/app/core/data/site-data.service';
import { LocaleService } from 'src/app/core/locale/locale.service';

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

  userAgreementText$: BehaviorSubject<string[]> = new BehaviorSubject(['']);

  constructor(private siteService: SiteDataService,
              private localeService: LocaleService) {

  }

  ngOnInit(): void {
    this.subs.push(this.siteService.find().subscribe((site) => {
      const langCode = this.localeService.getCurrentLanguageCode();
      let languageFound = false;
      for (const metadata of site.metadataAsList) {
        if (metadata.key === this.USER_AGREEMENT_TEXT_METADATA && metadata.language === langCode && metadata.value !== '') {
          this.userAgreementText$.next(metadata.value.split(/\r?\n/));
          languageFound = true;
        }
      }
      if (!languageFound) { // fallback to english if no text was found for the current language
        for (const metadata of site.metadataAsList) {
          if (metadata.key === this.USER_AGREEMENT_TEXT_METADATA && metadata.language === 'en') {
            this.userAgreementText$.next(metadata.value.split(/\r?\n/));
          }
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.userAgreementText$.unsubscribe();
  }

}
