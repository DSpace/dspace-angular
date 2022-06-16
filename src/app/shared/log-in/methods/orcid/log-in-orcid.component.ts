import { Component, } from '@angular/core';

import { renderAuthMethodFor } from '../log-in.methods-decorator';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { LogInExternalProviderComponent } from '../log-in-external-provider.component';

@Component({
  selector: 'ds-log-in-orcid',
  templateUrl: './log-in-orcid.component.html',
})
@renderAuthMethodFor(AuthMethodType.Orcid)
export class LogInOrcidComponent extends LogInExternalProviderComponent {

  /**
   * Redirect to orcid authentication url
   */
  redirectToOrcid() {
    this.redirectToExternalProvider();
  }

}
