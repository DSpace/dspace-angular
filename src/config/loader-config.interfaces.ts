import { Config } from './config.interface';

export interface LoaderConfig extends Config {
  enableFallbackMessagesByDefault: boolean;
  warningMessageDelay: number;
  errorMessageDelay: number;
}
