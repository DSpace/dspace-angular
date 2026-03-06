import { Config } from './config';

export interface ValidatorMap {
  [validator: string]: string;
}

export class FormConfig extends Config {
  @Config.publish() spellCheck: boolean;
  @Config.publish() validatorMap: ValidatorMap;
}
