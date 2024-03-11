import { Filter } from './filter.model';

export class FilterGroup {

  id: string;
  key: string;

  constructor(id: string, public filters: Filter[]) {
    this.id = id;
    this.key = 'admin.reports.commons.filters.' + id;
    filters.forEach(filter => {
      filter.key = this.key + '.' + filter.id;
      if (filter.hasTooltip) {
        filter.tooltipKey = filter.key + '.tooltip';
      }
    });
  }

}
