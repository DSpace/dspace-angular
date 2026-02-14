import { AppConfig } from './app.config';
import { Config } from './config';
import { SSRConfig } from './ssr.config';

export class BuildConfig extends AppConfig {
  @Config.publish() ssr: SSRConfig;
}
