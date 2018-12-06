import { AuthEffects } from './auth/auth.effects';
import { ObjectCacheEffects } from './cache/object-cache.effects';
import { ResponseCacheEffects } from './cache/response-cache.effects';
import { RequestEffects } from './data/request.effects';
import { UUIDIndexEffects } from './index/index.effects';

export const coreEffects = [
  ResponseCacheEffects,
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
  AuthEffects
];
