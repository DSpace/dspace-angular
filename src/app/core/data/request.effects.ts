import { Injectable, Inject } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { ObjectCacheService } from "../cache/object-cache.service";
import { DSpaceRESTV2Response } from "../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Serializer } from "../dspace-rest-v2/dspace-rest-v2.serializer";
import { CacheableObject } from "../cache/object-cache.reducer";
import { Observable } from "rxjs";
import { Response, SuccessResponse, ErrorResponse } from "../cache/response-cache.models";
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from "../../shared/empty.util";
import { GlobalConfig, GLOBAL_CONFIG } from "../../../config";
import {  RequestEntry } from "./request.reducer";
import {
  RequestActionTypes, RequestExecuteAction,
  RequestCompleteAction
} from "./request.actions";
import { ResponseCacheService } from "../cache/response-cache.service";
import { RequestService } from "./request.service";
import { NormalizedObjectFactory } from "../cache/models/normalized-object-factory";
import { ResourceType } from "../shared/resource-type";
import { RequestError } from "./request.models";
import { PageInfo } from "../shared/page-info.model";

function isObjectLevel(halObj: any) {
  return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}

function isPaginatedResponse(halObj: any) {
  return isNotEmpty(halObj.page) && hasValue(halObj._embedded);
}

@Injectable()
export class RequestEffects {

  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private objectCache: ObjectCacheService,
    private responseCache: ResponseCacheService,
    protected requestService: RequestService
  ) { }

  @Effect() execute = this.actions$
    .ofType(RequestActionTypes.EXECUTE)
    .flatMap((action: RequestExecuteAction) => {
      return this.requestService.get(action.payload)
        .take(1);
    })
    .flatMap((entry: RequestEntry) => {
      return this.restApi.get(entry.request.href)
        .map((data: DSpaceRESTV2Response) => new SuccessResponse(this.process(data.payload), data.statusCode, this.processPageInfo(data.payload.page)))
        .do((response: Response) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
        .map((response: Response) => new RequestCompleteAction(entry.request.href))
        .catch((error: RequestError) => Observable.of(new ErrorResponse(error))
          .do((response: Response) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
          .map((response: Response) => new RequestCompleteAction(entry.request.href)));
    });

  protected process(data: any): Array<string> {

    if (isNotEmpty(data)) {
      if (isPaginatedResponse(data)) {
        return this.process(data._embedded);
      }
      else if (isObjectLevel(data)) {
        return this.deserializeAndCache(data);
      }
      else {
        let uuids = [];
        Object.keys(data)
          .filter(property => data.hasOwnProperty(property))
          .filter(property => hasValue(data[property]))
          .forEach(property => {
            uuids = [...uuids, ...this.deserializeAndCache(data[property])];
          });
        return uuids;
      }
    }
  }

  protected deserializeAndCache(obj): Array<string> {
    let type: ResourceType;
    const isArray = Array.isArray(obj);

    if (isArray && isEmpty(obj)) {
      return [];
    }

    if (isArray) {
      type = obj[0]["type"];
    }
    else {
      type = obj["type"];
    }

    if (hasValue(type)) {
      const normObjConstructor = NormalizedObjectFactory.getConstructor(type);

      if (hasValue(normObjConstructor)) {
        const serializer = new DSpaceRESTv2Serializer(normObjConstructor);

        if (isArray) {
          obj.forEach(o => {
            if (isNotEmpty(o._embedded)) {
              this.process(o._embedded);
            }
          });
          const normalizedObjArr = serializer.deserializeArray(obj);
          normalizedObjArr.forEach(t => this.addToObjectCache(t));
          return normalizedObjArr.map(t => t.uuid);
        }
        else {
          if (isNotEmpty(obj._embedded)) {
            this.process(obj._embedded);
          }
          const normalizedObj = serializer.deserialize(obj);
          this.addToObjectCache(normalizedObj);
          return [normalizedObj.uuid];
        }

      }
      else {
        //TODO move check to Validator?
        throw new Error(`The server returned an object with an unknown a known type: ${type}`);
      }

    }
    else {
      //TODO move check to Validator
      throw new Error(`The server returned an object without a type: ${JSON.stringify(obj)}`);
    }
  }

  protected addToObjectCache(co: CacheableObject): void {
    if (hasNoValue(co) || hasNoValue(co.uuid)) {
      throw new Error('The server returned an invalid object');
    }
    this.objectCache.add(co, this.EnvConfig.cache.msToLive);
  }

  protected processPageInfo(pageObj: any): PageInfo {
    if (isNotEmpty(pageObj)) {
      return new DSpaceRESTv2Serializer(PageInfo).deserialize(pageObj);
    }
    else {
      return undefined;
    }
  }

}
