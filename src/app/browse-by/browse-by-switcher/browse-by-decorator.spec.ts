import { BrowseByDataType } from './browse-by-data-type';
import { BROWSE_BY_DECORATOR_MAP } from './browse-by-decorator';

describe('BrowseByDecorator', () => {
  const titleDecorator = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Title);
  const dateDecorator = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Date);
  const metadataDecorator = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Metadata);
  it('should have a decorator for all types', () => {
    expect(titleDecorator).toBeTruthy();
    expect(dateDecorator).toBeTruthy();
    expect(metadataDecorator).toBeTruthy();
  });
});
