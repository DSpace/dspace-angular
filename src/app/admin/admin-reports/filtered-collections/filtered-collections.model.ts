import { FilteredCollection } from './filtered-collection.model';

export class FilteredCollections {

  public collections: Array<FilteredCollection> = [];
  public summary: FilteredCollection = new FilteredCollection();

  public clear() {
    this.collections.splice(0, this.collections.length);
    this.summary.clear();
  }

  public deserialize(object: any) {
    this.clear();
    let summary = object.summary;
    this.summary.deserialize(summary);
    let collections = object.collections;
    for (let i = 0; i < collections.length; i++) {
      let collection = collections[i];
      let coll = new FilteredCollection();
      coll.deserialize(collection);
      this.collections.push(coll);
    }
  }

}
