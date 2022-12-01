import { Config } from './config.interface';

export interface FilterVocabularyConfig extends Config {
  filter: string;
  vocabulary: string;
  enabled: boolean;
}
