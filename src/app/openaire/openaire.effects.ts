import { OpenaireBrokerTopicsEffects } from './broker/topics/openaire-broker-topics.effects';
import { SuggestionTargetEffects } from './reciter/suggestion-target/suggestion-target.effects';

export const openaireEffects = [
  OpenaireBrokerTopicsEffects,
  SuggestionTargetEffects
];
