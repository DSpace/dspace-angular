
import { ObjectCacheEffects } from './cache/object-cache.effects';
import { ResponseCacheEffects } from './cache/response-cache.effects';
import { UUIDIndexEffects } from './index/uuid-index.effects';
import { RequestEffects } from './data/request.effects';

export const coreEffects = [
  ResponseCacheEffects,
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
];
