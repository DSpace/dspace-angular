import { ActionReducerMap } from '@ngrx/store';

import { authReducer } from './auth';
import {
  objectCacheReducer,
  serverSyncBufferReducer,
} from './cache';
import { CoreState } from './core-state.model';
import {
  objectUpdatesReducer,
  requestReducer,
} from './data';
import { historyReducer } from './history';
import { indexReducer } from './index';
import { jsonPatchOperationsReducer } from './json-patch';
import { metaTagReducer } from './metadata';
import { notificationsReducer } from './notifications';
import { routeReducer } from './services';
import {
  bitstreamFormatReducer,
  correlationIdReducer,
  ePeopleRegistryReducer,
  groupRegistryReducer,
  metadataRegistryReducer,
  nameVariantReducer,
} from './states';

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
