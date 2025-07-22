import { AuthEffects } from './auth';
import {
  ObjectCacheEffects,
  ServerSyncBufferEffects,
} from './cache';
import {
  ObjectUpdatesEffects,
  RequestEffects,
} from './data';
import { UUIDIndexEffects } from './index';
import { JsonPatchOperationsEffects } from './json-patch';
import { RouterEffects } from './router';
import { RouteEffects } from './services';
import { MenuEffects } from './states';

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
