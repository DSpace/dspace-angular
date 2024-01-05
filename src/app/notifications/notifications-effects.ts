import { QualityAssuranceSourceEffects } from './qa/source/quality-assurance-source.effects';
import { QualityAssuranceTopicsEffects } from './qa/topics/quality-assurance-topics.effects';

export const notificationsEffects = [
  QualityAssuranceTopicsEffects,
  QualityAssuranceSourceEffects
];
