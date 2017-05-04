import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { hasValue } from "../../shared/empty.util";
import { RemoteData } from "./remote-data";
import { FindAllRequest, FindByIDRequest, Request } from "./request.models";
import { Store } from "@ngrx/store";
import { RequestConfigureAction, RequestExecuteAction } from "./request.actions";
import { CoreState } from "../core.reducers";
import { RequestService } from "./request.service";
import { RemoteDataBuildService } from "../cache/builders/remote-data-build.service";
import { GenericConstructor } from "../shared/generic-constructor";

export abstract class DataService<TNormalized extends CacheableObject, TDomain> {
  protected abstract objectCache: ObjectCacheService;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract endpoint: string;

  constructor(private normalizedResourceType: GenericConstructor<TNormalized>) {

  }

  protected getFindAllHref(scopeID?): string {
    let result = this.endpoint;
    if (hasValue(scopeID)) {
      result += `?scope=${scopeID}`
    }
    return result;
  }

  findAll(scopeID?: string): RemoteData<Array<TDomain>> {
    const href = this.getFindAllHref(scopeID);
    if (!this.responseCache.has(href) && !this.requestService.isPending(href)) {
      const request = new FindAllRequest(href, this.normalizedResourceType, scopeID);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
    return this.rdbService.buildList<TNormalized, TDomain>(href, this.normalizedResourceType);
    // return this.rdbService.buildList(href);
  }

  protected getFindByIDHref(resourceID): string {
    return `${this.endpoint}/${resourceID}`;
  }

  findById(id: string): RemoteData<TDomain> {
    const href = this.getFindByIDHref(id);
    if (!this.objectCache.hasBySelfLink(href) && !this.requestService.isPending(href)) {
      const request = new FindByIDRequest(href, this.normalizedResourceType, id);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
    return this.rdbService.buildSingle<TNormalized, TDomain>(href, this.normalizedResourceType);
    // return this.rdbService.buildSingle(href);
  }

  findByHref(href: string): RemoteData<TDomain> {
    if (!this.objectCache.hasBySelfLink(href) && !this.requestService.isPending(href)) {
      const request = new Request(href, this.normalizedResourceType);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
    return this.rdbService.buildSingle<TNormalized, TDomain>(href, this.normalizedResourceType);
    // return this.rdbService.buildSingle(href));
  }

}
