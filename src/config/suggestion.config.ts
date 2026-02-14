import { Config } from './config';

export class SuggestionConfig extends Config {
  @Config.publish() source: string;
  @Config.publish() collectionId: string;
}
