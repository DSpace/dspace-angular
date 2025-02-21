import { MenuEffects } from './states';
import { AuthEffects } from './auth';
import { ObjectCacheEffects } from './cache';
import { ServerSyncBufferEffects } from './cache';
import { ObjectUpdatesEffects } from './data';
import { RequestEffects } from './data';
import { UUIDIndexEffects } from './index';
import { JsonPatchOperationsEffects } from './json-patch';
import { RouterEffects } from './router';
import { RouteEffects } from './services';

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
