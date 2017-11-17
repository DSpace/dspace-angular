
import { ObjectCacheEffects } from './data/object-cache.effects';
import { RequestCacheEffects } from './data/request-cache.effects';
import { UUIDIndexEffects } from './index/uuid-index.effects';
import { RequestEffects } from './data/request.effects';
import { JsonPatchOperationsEffects } from './json-patch/json-patch-operations.effects';

export const coreEffects = [
  RequestCacheEffects,
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
  JsonPatchOperationsEffects,
];
