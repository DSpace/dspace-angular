import { BrowseByType, rendersBrowseBy } from './browse-by-decorator';

describe('BrowseByDecorator', () => {
  const titleDecorator = rendersBrowseBy(BrowseByType.Title);
  const dateDecorator = rendersBrowseBy(BrowseByType.Date);
  const metadataDecorator = rendersBrowseBy(BrowseByType.Metadata);
  it('should have a decorator for all types', () => {
    expect(titleDecorator.length).not.toEqual(0);
    expect(dateDecorator.length).not.toEqual(0);
    expect(metadataDecorator.length).not.toEqual(0);
  });
});
