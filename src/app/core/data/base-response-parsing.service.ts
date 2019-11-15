import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { CacheableObject } from '../cache/object-cache.reducer';
import { PageInfo } from '../shared/page-info.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GenericConstructor } from '../shared/generic-constructor';
import { PaginatedList } from './paginated-list';
import { isRestDataObject, isRestPaginatedList } from '../cache/builders/normalized-object-build.service';
import { getMapsToType } from '../cache/builders/build-decorators';
import { RestRequest } from './request.models';
/* tslint:disable:max-classes-per-file */

export abstract class BaseResponseParsingService {
  protected abstract EnvConfig: GlobalConfig;
  protected abstract objectCache: ObjectCacheService;
  protected abstract toCache: boolean;

  protected process<ObjectDomain>(data: any, request: RestRequest): any {
    if (isNotEmpty(data)) {
      if (hasNoValue(data) || (typeof data !== 'object')) {
        return data;
      } else if (isRestPaginatedList(data)) {
        return this.processPaginatedList(data, request);
      } else if (Array.isArray(data)) {
        return this.processArray(data, request);
      } else if (isRestDataObject(data)) {
        const object = this.deserialize(data);
        if (isNotEmpty(data._embedded)) {
          Object
            .keys(data._embedded)
            .filter((property) => data._embedded.hasOwnProperty(property))
            .forEach((property) => {
              const parsedObj = this.process<ObjectDomain>(data._embedded[property], request);
              if (isNotEmpty(parsedObj)) {
                if (isRestPaginatedList(data._embedded[property])) {
                  object[property] = parsedObj;
                  object[property].page = parsedObj.page.map((obj) => this.retrieveObjectOrUrl(obj));
                } else if (isRestDataObject(data._embedded[property])) {
                  object[property] = this.retrieveObjectOrUrl(parsedObj);
                } else if (Array.isArray(parsedObj)) {
                  object[property] = parsedObj.map((obj) => this.retrieveObjectOrUrl(obj))
                }
              }
            });
        }

        this.cache(object, request);
        return object;
      }
      const result = {};
      Object.keys(data)
        .filter((property) => data.hasOwnProperty(property))
        .filter((property) => hasValue(data[property]))
        .forEach((property) => {
          result[property] = this.process(data[property], request);
        });
      return result;

    }
  }

  protected processPaginatedList<ObjectDomain>(data: any, request: RestRequest): PaginatedList<ObjectDomain> {
    const pageInfo: PageInfo = this.processPageInfo(data);
    let list = data._embedded;

    // Workaround for inconsistency in rest response. Issue: https://github.com/DSpace/dspace-angular/issues/238
    if (hasNoValue(list)) {
      list = [];
    } else if (!Array.isArray(list)) {
      list = this.flattenSingleKeyObject(list);
    }
    const page: ObjectDomain[] = this.processArray(list, request);
    return new PaginatedList<ObjectDomain>(pageInfo, page, );
  }

  protected processArray<ObjectDomain>(data: any, request: RestRequest): ObjectDomain[] {
    let array: ObjectDomain[] = [];
    data.forEach((datum) => {
        array = [...array, this.process(datum, request)];
      }
    );
    return array;
  }

  protected deserialize<ObjectDomain>(obj): any {
    const type: string = obj.type;
    if (hasValue(type)) {
      const normObjConstructor = getMapsToType(type) as GenericConstructor<ObjectDomain>;

      if (hasValue(normObjConstructor)) {
        const serializer = new DSpaceRESTv2Serializer(normObjConstructor);
        return serializer.deserialize(obj);
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

  protected cache<ObjectDomain>(obj, request: RestRequest) {
    if (this.toCache) {
      this.addToObjectCache(obj, request);
    }
  }

  protected addToObjectCache(co: CacheableObject, request: RestRequest): void {
    if (hasNoValue(co) || hasNoValue(co.self)) {
      throw new Error('The server returned an invalid object');
    }
    this.objectCache.add(co, hasValue(request.responseMsToLive) ? request.responseMsToLive : this.EnvConfig.cache.msToLive.default, request.uuid);
  }

  processPageInfo(payload: any): PageInfo {
    if (hasValue(payload) && hasValue(payload.page)) {
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

  protected retrieveObjectOrUrl(obj: any): any {
    return this.toCache ? obj.self : obj;
  }

  protected isSuccessStatus(statusCode: number) {
    return statusCode >= 200 && statusCode < 300;
  }
}
