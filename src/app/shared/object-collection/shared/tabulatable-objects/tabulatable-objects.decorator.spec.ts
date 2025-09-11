import { AdminNotifySearchResult, Context, ViewMode } from '@dspace/core'

import {
  AdminNotifySearchResultComponent,
} from '../../../../admin/admin-notify-dashboard/admin-notify-search-result/admin-notify-search-result.component';
import { getTabulatableObjectsComponent } from './tabulatable-objects.decorator';

describe('TabulatableObject decorator function', () => {

  it('should return the matching class', () => {
    const component = getTabulatableObjectsComponent([AdminNotifySearchResult], ViewMode.Table, Context.CoarNotify);
    expect(component).toEqual(AdminNotifySearchResultComponent);
  });
});
