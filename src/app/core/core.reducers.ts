import { ActionReducerMap } from '@ngrx/store';

import { metadataRegistryReducer } from '../admin/admin-registries/metadata-registry/metadata-registry.reducers';
import { authReducer } from './auth/auth.reducer';
import { objectCacheReducer } from './cache/object-cache.reducer';
import { serverSyncBufferReducer } from './cache/server-sync-buffer.reducer';
import { CoreState } from './core-state.model';
import { objectUpdatesReducer } from './data/object-updates/object-updates.reducer';
import { requestReducer } from './data/request.reducer';
import { historyReducer } from './history/history.reducer';
import { indexReducer } from './index/index.reducer';
import { jsonPatchOperationsReducer } from './json-patch/json-patch-operations.reducer';
import { metaTagReducer } from './metadata/meta-tag.reducer';
import { routeReducer } from './services/route.reducer';
import { bitstreamFormatReducer } from './states/bitstream-format/bitstream-format.reducers';
import { correlationIdReducer } from './states/correlation-id/correlation-id.reducer';
import { ePeopleRegistryReducer } from './states/epeople-registry/epeople-registry.reducers';
import { groupRegistryReducer } from './states/group-registry/group-registry.reducers';
import { nameVariantReducer } from './states/name-variant/name-variant.reducer';

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
};
