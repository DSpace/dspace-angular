import { AppConfig } from './app-config.interface';
import { SSRConfig } from './ssr-config.interface';

export interface BuildConfig extends AppConfig {
  ssr: SSRConfig;
}
