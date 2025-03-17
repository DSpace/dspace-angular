import {
    BitstreamFormatRegistryState
} from '../admin/admin-registries/bitstream-formats/bitstream-format.reducers';
import { ObjectCacheState } from './cache/object-cache.reducer';
import { ServerSyncBufferState } from './cache/server-sync-buffer.reducer';
import { ObjectUpdatesState } from './data/object-updates/object-updates.reducer';
import { HistoryState } from './history/history.reducer';
import { MetaIndexState } from './index/index.reducer';
import { AuthState } from './auth/auth.reducer';
import { JsonPatchOperationsState } from './json-patch/json-patch-operations.reducer';
import { MetaTagState } from './metadata/meta-tag.reducer';
import { RouteState } from './services/route.reducer';
import { RequestState } from './data/request-state.model';
import { ServerStatusState } from './history/server-status.reducer';

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
    'serverStatus': ServerStatusState;
    'index': MetaIndexState;
    'auth': AuthState;
    'json/patch': JsonPatchOperationsState;
    'metaTag': MetaTagState;
    'route': RouteState;
}
