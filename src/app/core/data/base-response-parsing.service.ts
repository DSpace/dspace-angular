import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { CacheableObject } from '../cache/object-cache.reducer';
import { PageInfo } from '../shared/page-info.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GenericConstructor } from '../shared/generic-constructor';
import { PaginatedList } from './paginated-list';
import { NormalizedObject } from '../cache/models/normalized-object.model';

function isObjectLevel(halObj: any) {
  return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}

function isPaginatedResponse(halObj: any) {
  return isNotEmpty(halObj.page) && hasValue(halObj._embedded);
}

/* tslint:disable:max-classes-per-file */

export abstract class BaseResponseParsingService {
  protected abstract EnvConfig: GlobalConfig;
  protected abstract objectCache: ObjectCacheService;
  protected abstract objectFactory: any;
  protected abstract toCache: boolean;

  protected process<ObjectDomain, ObjectType>(data: any, requestHref: string): any {

    if (isNotEmpty(data)) {
      if (hasNoValue(data) || (typeof data !== 'object')) {
        return data;
      } else if (isPaginatedResponse(data)) {
        return this.processPaginatedList(data, requestHref);
      } else if (Array.isArray(data)) {
        return this.processArray(data, requestHref);
      } else if (isObjectLevel(data)) {
        const object = this.deserialize(data);
        if (isNotEmpty(data._embedded)) {
          Object
            .keys(data._embedded)
            .filter((property) => data._embedded.hasOwnProperty(property))
            .forEach((property) => {
              const parsedObj = this.process<ObjectDomain, ObjectType>(data._embedded[property], requestHref);
              if (isNotEmpty(parsedObj)) {
                if (isPaginatedResponse(data._embedded[property])) {
                  object[property] = parsedObj;
                  object[property].page = parsedObj.page.map((obj) => obj.self);
                } else if (isObjectLevel(data._embedded[property])) {
                  object[property] = parsedObj.self;
                } else if (Array.isArray(parsedObj)) {
                  object[property] = parsedObj.map((obj) => obj.self)
                }
              }
            });
        }
        this.cache(object, requestHref);
        return object;
      }
      const result = {};
      Object.keys(data)
        .filter((property) => data.hasOwnProperty(property))
        .filter((property) => hasValue(data[property]))
        .forEach((property) => {
          const obj = this.process(data[property], requestHref);
          result[property] = obj;
        });
      return result;

    }
  }

  protected processPaginatedList<ObjectDomain, ObjectType>(data: any, requestHref: string): PaginatedList<ObjectDomain> {
    const pageInfo: PageInfo = this.processPageInfo(data);
    let list = data._embedded;

    // Workaround for inconsistency in rest response. Issue: https://github.com/DSpace/dspace-angular/issues/238
    if (!Array.isArray(list)) {
      list = this.flattenSingleKeyObject(list);
    }
    const page: ObjectDomain[] = this.processArray(list, requestHref);
    return new PaginatedList<ObjectDomain>(pageInfo, page);
  }

  protected processArray<ObjectDomain, ObjectType>(data: any, requestHref: string): ObjectDomain[] {
    let array: ObjectDomain[] = [];
    data.forEach((datum) => {
        array = [...array, this.process(datum, requestHref)];
      }
    );
    return array;
  }

  protected deserialize<ObjectDomain, ObjectType>(obj): any {
    const type: ObjectType = obj.type;
    if (hasValue(type)) {
      const normObjConstructor = this.objectFactory.getConstructor(type) as GenericConstructor<ObjectDomain>;

      if (hasValue(normObjConstructor)) {
        const serializer = new DSpaceRESTv2Serializer(normObjConstructor);
        const res = serializer.deserialize(obj);
        return res;
      } else {
        // TODO: move check to Validator?
        // throw new Error(`The server returned an object with an unknown a known type: ${type}`);
        return null;
      }

    } else {
      // TODO: move check to Validator
      // throw new Error(`The server returned an object without a type: ${JSON.stringify(obj)}`);
      return null;
    }
  }

  protected cache<ObjectDomain, ObjectType>(obj, requestHref) {
    if (this.toCache) {
      this.addToObjectCache(obj, requestHref);
    }
  }

  protected addToObjectCache(co: CacheableObject, requestHref: string): void {
    if (hasNoValue(co) || hasNoValue(co.self)) {
      throw new Error('The server returned an invalid object');
    }
    this.objectCache.add(co, this.EnvConfig.cache.msToLive, requestHref);
  }

  processPageInfo(payload: any): PageInfo {
    if (isNotEmpty(payload.page)) {
      const pageObj = Object.assign({}, payload.page, { _links: payload._links });
      const pageInfoObject = new DSpaceRESTv2Serializer(PageInfo).deserialize(pageObj);
      if (pageInfoObject.currentPage >= 0) {
        Object.assign(pageInfoObject, { currentPage: pageInfoObject.currentPage + 1 });
      }
      return pageInfoObject
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
}
