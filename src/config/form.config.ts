import { Config } from './config';

export interface ValidatorMap {
  [validator: string]: string;
}

export class FormConfig extends Config {
  @Config.public spellCheck = true;
  // NOTE: Map server-side validators to comparative Angular form validators
  @Config.public validatorMap: ValidatorMap = {
    required: 'required',
    regex: 'pattern',
  };
}
