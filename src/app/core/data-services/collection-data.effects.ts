import { Injectable } from "@angular/core";
import { DataEffects } from "./data.effects";
import { Serializer } from "../serializer";
import { Collection } from "../shared/collection.model";
import { DSpaceRESTv2Serializer } from "../dspace-rest-v2/dspace-rest-v2.serializer";
import { ObjectCacheService } from "../cache/object-cache.service";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { Actions, Effect } from "@ngrx/effects";
import { FindAllRequestCacheAction, FindByIDRequestCacheAction } from "../cache/request-cache.actions";
import { CollectionDataService } from "./collection-data.service";

@Injectable()
export class CollectionDataEffects extends DataEffects<Collection> {
  constructor(
    actions$: Actions,
    restApi: DSpaceRESTv2Service,
    cache: ObjectCacheService,
    dataService: CollectionDataService
  ) {
    super(actions$, restApi, cache, dataService);
  }

  protected getFindAllEndpoint(action: FindAllRequestCacheAction): string {
    return '/collections';
  }

  protected getFindByIdEndpoint(action: FindByIDRequestCacheAction): string {
    return `/collections/${action.payload.resourceID}`;
  }

  protected getSerializer(): Serializer<Collection> {
    return new DSpaceRESTv2Serializer(Collection);
  }

  @Effect() findAll$ = this.findAll;

  @Effect() findById$ = this.findById;
}
