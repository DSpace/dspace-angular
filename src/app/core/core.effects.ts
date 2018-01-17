
import { ObjectCacheEffects } from './cache/object-cache.effects';
import { ResponseCacheEffects } from './cache/response-cache.effects';
import { UUIDIndexEffects } from './index/uuid-index.effects';
import { RequestEffects } from './data/request.effects';
import { JsonPatchOperationsEffects } from './json-patch/json-patch-operations.effects';

export const coreEffects = [
  ResponseCacheEffects,
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
  JsonPatchOperationsEffects,
];
