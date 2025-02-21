import { ActionReducerMap } from '@ngrx/store';

import { metadataRegistryReducer } from './states';
import { authReducer } from './auth';
import { objectCacheReducer } from './cache';
import { serverSyncBufferReducer } from './cache';
import { CoreState } from './core-state.model';
import { objectUpdatesReducer } from './data';
import { requestReducer } from './data';
import { historyReducer } from './history';
import { indexReducer } from './index';
import { jsonPatchOperationsReducer } from './json-patch';
import { metaTagReducer } from './metadata';
import { routeReducer } from './services';
import { bitstreamFormatReducer } from './states';
import { correlationIdReducer } from './states';
import { ePeopleRegistryReducer } from './states';
import { groupRegistryReducer } from './states';
import { nameVariantReducer } from './states';
import { notificationsReducer } from "./notifications";

export const coreReducers: ActionReducerMap<CoreState> = {
  'bitstreamFormats': bitstreamFormatReducer,
  'cache/object': objectCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'cache/object-updates': objectUpdatesReducer,
  'data/request': requestReducer,
  'history': historyReducer,
  'index': indexReducer,
  'auth': authReducer,
  'json/patch': jsonPatchOperationsReducer,
  'metaTag': metaTagReducer,
  'route': routeReducer,
  'epeopleRegistry': ePeopleRegistryReducer,
  'relationshipLists': nameVariantReducer,
  'metadataRegistry': metadataRegistryReducer,
  'groupRegistry': groupRegistryReducer,
  'correlationId': correlationIdReducer,
  'notifications': notificationsReducer,
};
