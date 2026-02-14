import { Config } from './config';

export class InfoConfig extends Config {
  @Config.publish() enableEndUserAgreement?: boolean;
  @Config.publish() enablePrivacyStatement?: boolean;
  @Config.publish() enableCOARNotifySupport?: boolean;
  @Config.publish() enableCookieConsentPopup?: boolean;
}
