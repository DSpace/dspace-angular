import { Component, } from '@angular/core';

import { renderAuthMethodFor } from '../log-in.methods-decorator';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { LogInExternalProviderComponent } from '../log-in-external-provider.component';

@Component({
  selector: 'ds-log-in-oidc',
  templateUrl: './log-in-oidc.component.html',
})
@renderAuthMethodFor(AuthMethodType.Oidc)
export class LogInOidcComponent extends LogInExternalProviderComponent {

  /**
   * Redirect to orcid authentication url
   */
  redirectToOidc() {
    this.redirectToExternalProvider();
  }

}
