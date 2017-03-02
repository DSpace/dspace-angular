import { Action } from "@ngrx/store";
import { type } from "../../shared/ngrx/type";
import { CacheableObject } from "./object-cache.reducer";

export const ObjectCacheActionTypes = {
  ADD: type('dspace/core/cache/object/ADD'),
  REMOVE: type('dspace/core/cache/object/REMOVE')
};

export class AddToObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.ADD;
  payload: {
    objectToCache: CacheableObject;
    timeAdded: number;
    msToLive: number;
  };

  constructor(objectToCache: CacheableObject, timeAdded: number, msToLive: number) {
    this.payload = { objectToCache, timeAdded, msToLive };
  }
}

export class RemoveFromObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.REMOVE;
  payload: string;

  constructor(uuid: string) {
    this.payload = uuid;
  }
}

export type ObjectCacheAction
  = AddToObjectCacheAction
  | RemoveFromObjectCacheAction
