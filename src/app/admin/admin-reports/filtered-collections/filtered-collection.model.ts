export class FilteredCollection {

  public label: string;
  public handle: string;
  public communityLabel: string;
  public communityHandle: string;
  public nbTotalItems: number;
  public values = {};
  public allFiltersValue: number;

  public clear() {
    this.label = '';
    this.handle = '';
    this.communityLabel = '';
    this.communityHandle = '';
    this.nbTotalItems = 0;
    this.values = {};
    this.allFiltersValue = 0;
  }

  public deserialize(object: any) {
    this.clear();
    this.label = object.label;
    this.handle = object.handle;
    this.communityLabel = object.community_label;
    this.communityHandle = object.community_handle;
    this.nbTotalItems = object.nb_total_items;
    const valuesPerFilter = object.values;
    for (const filter in valuesPerFilter) {
      if (valuesPerFilter.hasOwnProperty(filter)) {
        this.values[filter] = valuesPerFilter[filter];
      }
    }
    this.allFiltersValue = object.all_filters_value;
  }
}
