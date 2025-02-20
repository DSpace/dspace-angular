import { MetadataRegistryState } from '../admin/admin-registries/metadata-registry/metadata-registry.reducers';
import { AuthState } from './auth/auth.reducer';
import { ObjectCacheState } from './cache/object-cache.reducer';
import { ServerSyncBufferState } from './cache/server-sync-buffer.reducer';
import { ObjectUpdatesState } from './data/object-updates/object-updates.reducer';
import { RequestState } from './data/request-state.model';
import { HistoryState } from './history/history.reducer';
import { MetaIndexState } from './index/index.reducer';
import { JsonPatchOperationsState } from './json-patch/json-patch-operations.reducer';
import { MetaTagState } from './metadata/meta-tag.reducer';
import { RouteState } from './services/route.reducer';
import { BitstreamFormatRegistryState } from './states/bitstream-format/bitstream-format.reducers';
import { EPeopleRegistryState } from './states/epeople-registry/epeople-registry.reducers';
import { GroupRegistryState } from './states/group-registry/group-registry.reducers';
import { NameVariantListsState } from './states/name-variant/name-variant.reducer';

/**
 * The core sub-state in the NgRx store
 */
export interface CoreState {
    'bitstreamFormats': BitstreamFormatRegistryState;
    'cache/object': ObjectCacheState;
    'cache/syncbuffer': ServerSyncBufferState;
    'cache/object-updates': ObjectUpdatesState;
    'data/request': RequestState;
    'history': HistoryState;
    'index': MetaIndexState;
    'auth': AuthState;
    'json/patch': JsonPatchOperationsState;
    'metaTag': MetaTagState;
    'route': RouteState;
    'epeopleRegistry': EPeopleRegistryState;
    'relationshipLists': NameVariantListsState;
    'metadataRegistry': MetadataRegistryState;
    'groupRegistry': GroupRegistryState;
    'correlationId': string;
}
