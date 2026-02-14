import { Config } from './config';

export class SuggestionConfig extends Config {
  @Config.public source: string;
  @Config.public collectionId: string;
}
