import { DEFAULT_THEME } from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { BrowseByDataType } from './browse-by-data-type';
import {
  DEFAULT_BROWSE_BY_CONTEXT,
  getComponentByBrowseByType,
} from './browse-by-decorator';

describe('BrowseByDecorator', () => {
  it('should have a decorator for title', async () => {
    const component = await getComponentByBrowseByType(BrowseByDataType.Title, DEFAULT_BROWSE_BY_CONTEXT, DEFAULT_THEME);
    expect(component).toBeTruthy();
  });

  it('should have a decorator for date', async () => {
    const component = getComponentByBrowseByType(BrowseByDataType.Date, DEFAULT_BROWSE_BY_CONTEXT, DEFAULT_THEME);

    expect(component).toBeTruthy();
  });

  it('should have a decorator for metadata', async () => {
    const component = getComponentByBrowseByType(BrowseByDataType.Metadata, DEFAULT_BROWSE_BY_CONTEXT, DEFAULT_THEME);
    expect(component).toBeTruthy();
  });
});
