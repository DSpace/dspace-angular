import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CollectionDataState } from "./collection-data.reducer";
import { Store } from "@ngrx/store";
import { Collection } from "../../shared/collection.model";
import { CollectionFindMultipleRequestAction } from "./collection-find-multiple.actions";
import { CollectionFindByIdRequestAction } from "./collection-find-single.actions";
import { isNotEmpty } from "../../../shared/empty.util";
import 'rxjs/add/operator/filter';

@Injectable()
export class CollectionDataService {
  constructor(
    private store: Store<CollectionDataState>
  ) { }

  findAll(scope?: Collection): Observable<Collection[]> {
    this.store.dispatch(new CollectionFindMultipleRequestAction(scope));
    return this.store.select<Collection[]>('core', 'collectionData', 'findMultiple', 'collections');
  }

  findById(id: string): Observable<Collection> {
    this.store.dispatch(new CollectionFindByIdRequestAction(id));
    return this.store.select<Collection>('core', 'collectionData', 'findSingle', 'collection')
      //this filter is necessary because the same collection
      //object in the state is used for every findById call
      .filter(collection => isNotEmpty(collection) && collection.id === id);
  }

}
