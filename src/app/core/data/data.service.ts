import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { hasValue } from "../../shared/empty.util";
import { GenericConstructor } from "../shared/generic-constructor";
import { RemoteData } from "./remote-data";
import { FindAllRequest, FindByIDRequest, Request } from "./request.models";
import { Store } from "@ngrx/store";
import { RequestConfigureAction, RequestExecuteAction } from "./request.actions";
import { CoreState } from "../core.reducers";
import { RemoteDataBuilder } from "../cache/models/remote-data-builder";
import { RequestService } from "./request.service";

export abstract class DataService<T, U extends CacheableObject> {
  protected abstract objectCache: ObjectCacheService;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract store: Store<CoreState>;
  protected abstract endpoint: string;

  constructor(private normalizedResourceType: GenericConstructor<U>) {

  }

  protected abstract getListDataBuilder(href: string): RemoteDataBuilder<T[]>;
  protected abstract getSingleDataBuilder(href: string): RemoteDataBuilder<T>;

  protected getFindAllHref(scopeID?): string {
    let result = this.endpoint;
    if (hasValue(scopeID)) {
      result += `?scope=${scopeID}`
    }
    return result;
  }

  findAll(scopeID?: string): RemoteData<Array<T>> {
    const href = this.getFindAllHref(scopeID);
    if (!this.responseCache.has(href) && !this.requestService.isPending(href)) {
      const request = new FindAllRequest(href, this.normalizedResourceType, scopeID);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
    return this.getListDataBuilder(href).build();
  }

  protected getFindByIDHref(resourceID): string {
    return `${this.endpoint}/${resourceID}`;
  }

  findById(id: string): RemoteData<T> {
    const href = this.getFindByIDHref(id);
    if (!this.objectCache.hasBySelfLink(href) && !this.requestService.isPending(href)) {
      const request = new FindByIDRequest(href, this.normalizedResourceType, id);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
    return this.getSingleDataBuilder(href).build();
  }

  findByHref(href: string): RemoteData<T> {
    if (!this.objectCache.hasBySelfLink(href) && !this.requestService.isPending(href)) {
      const request = new Request(href, this.normalizedResourceType);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
    return this.getSingleDataBuilder(href).build();
  }

}
