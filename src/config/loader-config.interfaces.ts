import { Config } from './config.interface';

export interface LoaderConfig extends Config {
  showFallbackMessagesByDefault: boolean;
  warningMessageDelay: number;
  errorMessageDelay: number;
  numberOfAutomaticPageReloads: number;
}
