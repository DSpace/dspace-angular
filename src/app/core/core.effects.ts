import { MenuEffects } from '../shared/menu/menu.effects';
import { AuthEffects } from './auth/auth.effects';
import { ObjectCacheEffects } from './cache/object-cache.effects';
import { ServerSyncBufferEffects } from './cache/server-sync-buffer.effects';
import { ObjectUpdatesEffects } from './data/object-updates/object-updates.effects';
import { RequestEffects } from './data/request.effects';
import { UUIDIndexEffects } from './index/index.effects';
import { JsonPatchOperationsEffects } from './json-patch/json-patch-operations.effects';
import { RouterEffects } from './router/router.effects';
import { RouteEffects } from './services/route.effects';

export const coreEffects = [
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
  AuthEffects,
  JsonPatchOperationsEffects,
  ServerSyncBufferEffects,
  ObjectUpdatesEffects,
  RouteEffects,
  RouterEffects,
  MenuEffects,
];
