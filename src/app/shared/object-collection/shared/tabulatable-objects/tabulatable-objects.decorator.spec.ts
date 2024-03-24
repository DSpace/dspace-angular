import { AdminNotifySearchResultComponent } from '../../../../admin/admin-notify-dashboard/admin-notify-search-result/admin-notify-search-result.component';
import { AdminNotifySearchResult } from '../../../../admin/admin-notify-dashboard/models/admin-notify-message-search-result.model';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getTabulatableObjectsComponent } from './tabulatable-objects.decorator';

describe('TabulatableObject decorator function', () => {

  it('should return the matching class', () => {
    const component = getTabulatableObjectsComponent([AdminNotifySearchResult], ViewMode.Table, Context.CoarNotify);
    expect(component).toEqual(AdminNotifySearchResultComponent);
  });
});
