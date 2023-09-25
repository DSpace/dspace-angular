import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEmailComponent } from './email-confirmation/confirm-email/confirm-email.component';
import { ConfirmationSentComponent } from './email-confirmation/confirmation-sent/confirmation-sent.component';
import { ProvideEmailComponent } from './email-confirmation/provide-email/provide-email.component';
import { ExternalLogInComponent } from './external-log-in/external-log-in.component';
import { OrcidConfirmationComponent } from './registration-types/orcid-confirmation/orcid-confirmation.component';
import { SharedModule } from '../shared/shared.module';

const COMPONENTS = [
  ExternalLogInComponent,
  ProvideEmailComponent,
  ConfirmEmailComponent,
  ConfirmationSentComponent,
];

const ENTRY_COMPONENTS = [OrcidConfirmationComponent];

@NgModule({
  declarations: [...COMPONENTS, ...ENTRY_COMPONENTS],
  imports: [CommonModule, SharedModule],
  exports: [...COMPONENTS, ...ENTRY_COMPONENTS],
})
export class ExternalLoginModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: ExternalLoginModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
