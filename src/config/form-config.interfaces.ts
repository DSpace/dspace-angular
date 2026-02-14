import { Config } from './config';

export interface ValidatorMap {
  [validator: string]: string;
}

export class FormConfig extends Config {
  @Config.public spellCheck = true;
  @Config.public validatorMap: ValidatorMap = {
    required: 'required',
    regex: 'pattern',
  };
}
