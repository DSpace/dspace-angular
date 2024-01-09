import {
  LogInExternalProviderComponent
} from '../shared/log-in/methods/log-in-external-provider/log-in-external-provider.component';
import { LogInPasswordComponent } from '../shared/log-in/methods/password/log-in-password.component';


/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const renderAuthMethod =
  [
    LogInExternalProviderComponent,
    LogInPasswordComponent,
  ];
