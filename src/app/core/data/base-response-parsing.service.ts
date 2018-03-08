import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { CacheableObject } from '../cache/object-cache.reducer';
import { PageInfo } from '../shared/page-info.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { GenericConstructor } from '../shared/generic-constructor';

function isObjectLevel(halObj: any) {
  return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}

function isPaginatedResponse(halObj: any) {
  return isNotEmpty(halObj.page) && hasValue(halObj._embedded);
}

/* tslint:disable:max-classes-per-file */

export class ProcessRequestDTO<ObjectDomain> {
  [key: string]: ObjectDomain[]
}

export abstract class BaseResponseParsingService {
  protected abstract EnvConfig: GlobalConfig;
  protected abstract objectCache: ObjectCacheService;
  protected abstract objectFactory: any;
  protected abstract toCache: boolean;

  protected process<ObjectDomain,ObjectType>(data: any, requestHref: string): ProcessRequestDTO<ObjectDomain> {

    if (isNotEmpty(data)) {
      if (isPaginatedResponse(data)) {
        return this.process(data._embedded, requestHref);
      } else if (isObjectLevel(data)) {
        return { topLevel: this.deserializeAndCache(data, requestHref) };
      } else {
        const result = new ProcessRequestDTO<ObjectDomain>();
        if (Array.isArray(data)) {
          result.topLevel = [];
          data.forEach((datum) => {
            if (isPaginatedResponse(datum)) {
              const obj = this.process(datum, requestHref);
              result.topLevel = [...result.topLevel, ...this.flattenSingleKeyObject(obj)];
            } else {
              result.topLevel = [...result.topLevel, ...this.deserializeAndCache<ObjectDomain,ObjectType>(datum, requestHref)];
            }
          });
        } else {
          Object.keys(data)
            .filter((property) => data.hasOwnProperty(property))
            .filter((property) => hasValue(data[property]))
            .forEach((property) => {
              if (isPaginatedResponse(data[property])) {
                const obj = this.process(data[property], requestHref);
                result[property] = this.flattenSingleKeyObject(obj);
              } else {
                result[property] = this.deserializeAndCache(data[property], requestHref);
              }
            });
        }
        return result;
      }
    }
  }

  protected deserializeAndCache<ObjectDomain,ObjectType>(obj, requestHref: string): ObjectDomain[] {
    if (Array.isArray(obj)) {
      let result = [];
      obj.forEach((o) => result = [...result, ...this.deserializeAndCache<ObjectDomain,ObjectType>(o, requestHref)]);
      return result;
    }

    const type: ObjectType = obj.type;
    if (hasValue(type)) {
      const normObjConstructor = this.objectFactory.getConstructor(type) as GenericConstructor<ObjectDomain>;

      if (hasValue(normObjConstructor)) {
        const serializer = new DSpaceRESTv2Serializer(normObjConstructor);

        let processed;
        if (isNotEmpty(obj._embedded)) {
          processed = this.process<ObjectDomain,ObjectType>(obj._embedded, requestHref);
        }
        const normalizedObj: any = serializer.deserialize(obj);

        if (isNotEmpty(processed)) {
          const processedList = {};
          Object.keys(processed).forEach((key) => {
            processedList[key] = processed[key].map((no: NormalizedObject) => (this.toCache) ? no.self : no);
          });
          Object.assign(normalizedObj, processedList);
        }

        if (this.toCache) {
          this.addToObjectCache(normalizedObj, requestHref);
        }
        return [normalizedObj] as any;

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
    if (hasNoValue(co) || hasNoValue(co.self)) {
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

  protected flattenSingleKeyObject(obj: any): any {
    const keys = Object.keys(obj);
    if (keys.length !== 1) {
      throw new Error(`Expected an object with a single key, got: ${JSON.stringify(obj)}`);
    }
    return obj[keys[0]];
  }

  protected isSuccessStatus(statusCode) {
    return (statusCode === '201'
      || statusCode === '200'
      || statusCode === '204'
      || statusCode === 'OK'
      || statusCode === 'Created')
  }
}
