import { Injectable } from "@angular/core";
import { DataEffects } from "./data.effects";
import { Serializer } from "../serializer";
import { Collection } from "../shared/collection.model";
import { DSpaceRESTv2Serializer } from "../dspace-rest-v2/dspace-rest-v2.serializer";
import { CacheService } from "./cache/cache.service";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { Actions, Effect } from "@ngrx/effects";
import { DataFindAllRequestAction, DataFindByIDRequestAction } from "./data.actions";
import { CollectionDataService } from "./collection-data.service";

@Injectable()
export class CollectionDataEffects extends DataEffects<Collection> {
  constructor(
    actions$: Actions,
    restApi: DSpaceRESTv2Service,
    cache: CacheService,
    dataService: CollectionDataService
  ) {
    super(actions$, restApi, cache, dataService);
  }

  protected getFindAllEndpoint(action: DataFindAllRequestAction): string {
    return '/collections';
  }

  protected getFindByIdEndpoint(action: DataFindByIDRequestAction): string {
    return `/collections/${action.payload.resourceID}`;
  }

  protected getSerializer(): Serializer<Collection> {
    return new DSpaceRESTv2Serializer(Collection);
  }

  @Effect() findAll$ = this.findAll;

  @Effect() findById$ = this.findById;
}
