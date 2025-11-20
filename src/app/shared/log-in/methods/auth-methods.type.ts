import { LogInExternalProviderComponent } from './log-in-external-provider/log-in-external-provider.component';
//import { LogInPasswordComponent } from './password/log-in-password.component'; //TODO: remove comment
import { ThemedLogInPasswordComponent } from './password/themed-log-in-password.component';

export type AuthMethodTypeComponent =
  //typeof LogInPasswordComponent | //TODO: remove comment
  typeof ThemedLogInPasswordComponent |
  typeof LogInExternalProviderComponent;
