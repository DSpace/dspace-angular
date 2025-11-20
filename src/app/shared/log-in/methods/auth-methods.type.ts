import { LogInExternalProviderComponent } from './log-in-external-provider/log-in-external-provider.component';
import { ThemedLogInPasswordComponent } from './password/themed-log-in-password.component';

export type AuthMethodTypeComponent =
  typeof ThemedLogInPasswordComponent |
  typeof LogInExternalProviderComponent;
