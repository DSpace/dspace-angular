import { Injectable, Inject } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { CacheableObject } from '../cache/object-cache.reducer';
import { Response, SuccessResponse, ErrorResponse } from '../cache/response-cache.models';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RequestEntry } from './request.reducer';
import { RequestActionTypes, RequestExecuteAction, RequestCompleteAction } from './request.actions';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from './request.service';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { ResourceType } from '../shared/resource-type';
import { RequestError } from './request.models';
import { PageInfo } from '../shared/page-info.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';

import { GlobalConfig, GLOBAL_CONFIG } from '../../../config';

function isObjectLevel(halObj: any) {
  return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}

function isPaginatedResponse(halObj: any) {
  return isNotEmpty(halObj.page) && hasValue(halObj._embedded);
}

function flattenSingleKeyObject(obj: any): any {
  const keys = Object.keys(obj);
  if (keys.length !== 1) {
    throw new Error(`Expected an object with a single key, got: ${JSON.stringify(obj)}`);
  }
  return obj[keys[0]];
}

/* tslint:disable:max-classes-per-file */
class ProcessRequestDTO {
  [key: string]: NormalizedObject[]
}

@Injectable()
export class RequestEffects {

  @Effect() execute = this.actions$
    .ofType(RequestActionTypes.EXECUTE)
    .flatMap((action: RequestExecuteAction) => {
      return this.requestService.get(action.payload)
        .take(1);
    })
    .flatMap((entry: RequestEntry) => {
      return this.restApi.get(entry.request.href)
        .map((data: DSpaceRESTV2Response) => {
          const processRequestDTO = this.process(data.payload, entry.request.href);
          const uuids = flattenSingleKeyObject(processRequestDTO).map((no) => no.uuid);
          return new SuccessResponse(uuids, data.statusCode, this.processPageInfo(data.payload.page))
        }).do((response: Response) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
        .map((response: Response) => new RequestCompleteAction(entry.request.href))
        .catch((error: RequestError) => Observable.of(new ErrorResponse(error))
          .do((response: Response) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
          .map((response: Response) => new RequestCompleteAction(entry.request.href)));
    });

  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private objectCache: ObjectCacheService,
    private responseCache: ResponseCacheService,
    protected requestService: RequestService
  ) { }

  protected process(data: any, requestHref: string): ProcessRequestDTO {

    if (isNotEmpty(data)) {
      if (isPaginatedResponse(data)) {
        return this.process(data._embedded, requestHref);
      } else if (isObjectLevel(data)) {
        return { topLevel: this.deserializeAndCache(data, requestHref) };
      } else {
        const result = new ProcessRequestDTO();
        if (Array.isArray(data)) {
          result.topLevel = [];
          data.forEach((datum) => {
            if (isPaginatedResponse(datum)) {
              const obj = this.process(datum, requestHref);
              result.topLevel = [...result.topLevel, ...flattenSingleKeyObject(obj)];
            } else {
              result.topLevel = [...result.topLevel, ...this.deserializeAndCache(datum, requestHref)];
            }
          });
        } else {
          Object.keys(data)
            .filter((property) => data.hasOwnProperty(property))
            .filter((property) => hasValue(data[property]))
            .forEach((property) => {
              if (isPaginatedResponse(data[property])) {
                const obj = this.process(data[property], requestHref);
                result[property] = flattenSingleKeyObject(obj);
              } else {
                result[property] = this.deserializeAndCache(data[property], requestHref);
              }
            });
        }
        return result;
      }
    }
  }

  protected deserializeAndCache(obj, requestHref: string): NormalizedObject[] {
    if (Array.isArray(obj)) {
      let result = [];
      obj.forEach((o) => result = [...result, ...this.deserializeAndCache(o, requestHref)])
      return result;
    }

    const type: ResourceType = obj.type;
    if (hasValue(type)) {
      const normObjConstructor = NormalizedObjectFactory.getConstructor(type);

      if (hasValue(normObjConstructor)) {
        const serializer = new DSpaceRESTv2Serializer(normObjConstructor);

        let processed;
        if (isNotEmpty(obj._embedded)) {
          processed = this.process(obj._embedded, requestHref);
        }
        const normalizedObj = serializer.deserialize(obj);

        if (isNotEmpty(processed)) {
          const linksOnly = {};
          Object.keys(processed).forEach((key) => {
            linksOnly[key] = processed[key].map((no: NormalizedObject) => no.self);
          });
          Object.assign(normalizedObj, linksOnly);
        }

        this.addToObjectCache(normalizedObj, requestHref);
        return [normalizedObj];

      } else {
        // TODO: move check to Validator?
        // throw new Error(`The server returned an object with an unknown a known type: ${type}`);
        return [];
      }

    } else {
      // TODO: move check to Validator
      // throw new Error(`The server returned an object without a type: ${JSON.stringify(obj)}`);
      return [];
    }
  }

  protected addToObjectCache(co: CacheableObject, requestHref: string): void {
    if (hasNoValue(co) || hasNoValue(co.uuid)) {
      throw new Error('The server returned an invalid object');
    }
    this.objectCache.add(co, this.EnvConfig.cache.msToLive, requestHref);
  }

  protected processPageInfo(pageObj: any): PageInfo {
    if (isNotEmpty(pageObj)) {
      return new DSpaceRESTv2Serializer(PageInfo).deserialize(pageObj);
    } else {
      return undefined;
    }
  }

}
/* tslint:enable:max-classes-per-file */
