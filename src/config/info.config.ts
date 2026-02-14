import {
  Config,
  toBoolean,
} from './config';

export class InfoConfig extends Config {
  @Config.public enableEndUserAgreement = true;
  @Config.public enablePrivacyStatement = true;
  @Config.public enableCOARNotifySupport = true;

  @Config.public
  @Config.env('DSPACE_INFO_ENABLECOOKIECONSENTPOPUP', toBoolean)
  enableCookieConsentPopup = true;
}
