import { Component, OnInit, Optional } from '@angular/core';
import { hasValue } from '../shared/empty.util';
import { KlaroService } from '../shared/cookies/klaro.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../core/data/configuration-data.service';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent implements OnInit {
  dateObj: number = Date.now();

  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;
  showPrivacyPolicy = environment.info.enablePrivacyStatement;
  showEndUserAgreement = environment.info.enableEndUserAgreement;

  /**
   * The company url which customized this DSpace with redirection to the DSpace section
   */
  themedByUrl$: Observable<RemoteData<ConfigurationProperty>>;

  /**
   * The company name which customized this DSpace with redirection to the DSpace section
   */
  themedByCompanyName$: Observable<RemoteData<ConfigurationProperty>>;

  constructor(@Optional() private cookies: KlaroService,
              protected configurationDataService: ConfigurationDataService) {
  }

  ngOnInit(): void {
    this.loadThemedByProps();
  }

  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }

  private loadThemedByProps() {
    this.themedByUrl$ = this.configurationDataService.findByPropertyName('themed.by.url');
    this.themedByCompanyName$ = this.configurationDataService.findByPropertyName('themed.by.company.name');
  }
}
