import { Action } from "@ngrx/store";
import { type } from "../../../shared/ngrx/type";
import { CacheableObject } from "./cache.reducer";

export const CacheActionTypes = {
  ADD: type('dspace/core/data/cache/ADD'),
  REMOVE: type('dspace/core/data/cache/REMOVE')
};

export class AddToCacheAction implements Action {
  type = CacheActionTypes.ADD;
  payload: {
    objectToCache: CacheableObject;
    msToLive: number;
  };

  constructor(objectToCache: CacheableObject, msToLive: number) {
    this.payload = { objectToCache, msToLive };
  }
}

export class RemoveFromCacheAction implements Action {
  type = CacheActionTypes.REMOVE;
  payload: string;

  constructor(uuid: string) {
    this.payload = uuid;
  }
}

export type CacheAction
  = AddToCacheAction
  | RemoveFromCacheAction
