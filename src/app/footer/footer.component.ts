import {
  AsyncPipe,
  DatePipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Optional,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { KlaroService } from '../shared/cookies/klaro.service';
import { hasValue } from '../shared/empty.util';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, DatePipe, TranslateModule],
})
export class FooterComponent {
  dateObj: number = Date.now();

  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;
  showPrivacyPolicy = environment.info.enablePrivacyStatement;
  showEndUserAgreement = environment.info.enableEndUserAgreement;
  showSendFeedback$: Observable<boolean>;
  coarLdnEnabled: boolean;

  constructor(
    @Optional() private cookies: KlaroService,
    private authorizationService: AuthorizationDataService,
    private notifyInfoService: NotifyInfoService,
  ) {
    this.showSendFeedback$ = this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);
    this.notifyInfoService.isCoarConfigEnabled().subscribe(coarLdnEnabled => {
      this.coarLdnEnabled = coarLdnEnabled;
    });
  }

  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }
}
