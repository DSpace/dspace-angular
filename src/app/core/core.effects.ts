import { ObjectCacheEffects } from './cache/object-cache.effects';
import { UUIDIndexEffects } from './index/index.effects';
import { RequestEffects } from './data/request.effects';
import { AuthEffects } from './auth/auth.effects';
import { ServerSyncBufferEffects } from './cache/server-sync-buffer.effects';
import { ObjectUpdatesEffects } from './data/object-updates/object-updates.effects';

export const coreEffects = [
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
  AuthEffects,
  ServerSyncBufferEffects,
  ObjectUpdatesEffects,
];
