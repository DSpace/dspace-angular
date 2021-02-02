import { OpenaireBrokerTopicsEffects } from './broker/topics/openaire-broker-topics.effects';
import { SuggestionTargetsEffects } from './reciter-suggestions/suggestion-targets/suggestion-targets.effects';

export const openaireEffects = [
  OpenaireBrokerTopicsEffects,
  SuggestionTargetsEffects
];
