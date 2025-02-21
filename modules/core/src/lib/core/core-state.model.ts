import { MetadataRegistryState } from './states';
import { AuthState } from './auth';
import { ObjectCacheState } from './cache';
import { ServerSyncBufferState } from './cache';
import { ObjectUpdatesState } from './data';
import { RequestState } from './data';
import { HistoryState } from './history';
import { MetaIndexState } from './index';
import { JsonPatchOperationsState } from './json-patch';
import { MetaTagState } from './metadata';
import { RouteState } from './services';
import { BitstreamFormatRegistryState } from './states';
import { EPeopleRegistryState } from './states';
import { GroupRegistryState } from './states';
import { NameVariantListsState } from './states';
import { NotificationsState } from "./notifications";

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
    'notifications': NotificationsState;
}
