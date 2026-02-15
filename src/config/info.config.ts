import { Config } from './config';

const toBoolean = (val: string) => (val === 'true' || val === '1');

export class InfoConfig extends Config {
  @Config.publish() enableEndUserAgreement?: boolean;
  @Config.publish() enablePrivacyStatement?: boolean;
  @Config.publish() enableCOARNotifySupport?: boolean;

  @Config.publish()
  @Config.env('DSPACE_INFO_ENABLECOOKIECONSENTPOPUP', toBoolean)
  enableCookieConsentPopup?: boolean;
}
