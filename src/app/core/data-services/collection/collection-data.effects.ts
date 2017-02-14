import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Collection } from "../../shared/collection.model";
import { Observable } from "rxjs";
import {
  CollectionFindMultipleActionTypes,
  CollectionFindMultipleSuccessAction,
  CollectionFindMultipleErrorAction
} from "./collection-find-multiple.actions";
import {
  CollectionFindSingleActionTypes,
  CollectionFindByIdSuccessAction,
  CollectionFindByIdErrorAction
} from "./collection-find-single.actions";
import { DSpaceRESTV2Response } from "../../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Serializer } from "../../dspace-rest-v2/dspace-rest-v2.serializer";
import { DSpaceRESTv2Service } from "../../dspace-rest-v2/dspace-rest-v2.service";


@Injectable()
export class CollectionDataEffects {
  constructor(
    private actions$: Actions,
    private restApiService: DSpaceRESTv2Service
  ) {}

  @Effect() findAll$ = this.actions$
    .ofType(CollectionFindMultipleActionTypes.FIND_MULTI_REQUEST)
    .switchMap(() => {
      return this.restApiService.get('/collections')
        .map((data: DSpaceRESTV2Response) => new DSpaceRESTv2Serializer(Collection).deserializeArray(data))
        .map((collections: Collection[]) => new CollectionFindMultipleSuccessAction(collections))
        .catch((errorMsg: string) => Observable.of(new CollectionFindMultipleErrorAction(errorMsg)));
    });

  @Effect() findById$ = this.actions$
    .ofType(CollectionFindSingleActionTypes.FIND_BY_ID_REQUEST)
    .switchMap(action => {
      return this.restApiService.get(`/collections/${action.payload}`)
        .map((data: DSpaceRESTV2Response) => {
          const t = new DSpaceRESTv2Serializer(Collection).deserialize(data);
          return t;
        })
        .map((collection: Collection) => new CollectionFindByIdSuccessAction(collection))
        .catch((errorMsg: string) => Observable.of(new CollectionFindByIdErrorAction(errorMsg)));
    });
}
