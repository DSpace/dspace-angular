import { Config } from './config.interface';

export interface SuggestionConfig extends Config {
  source: string;
  collectionId: string;
}
