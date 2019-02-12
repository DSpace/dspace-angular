import { renderStartsWithFor } from './browse-by-starts-with-decorator';
import { BrowseByStartsWithType } from '../browse-by.component';

describe('BrowseByStartsWithDecorator', () => {
  const textDecorator = renderStartsWithFor(BrowseByStartsWithType.text);
  const dateDecorator = renderStartsWithFor(BrowseByStartsWithType.date);
  it('should have a decorator for both text and date', () => {
    expect(textDecorator.length).not.toBeNull();
    expect(dateDecorator.length).not.toBeNull();
  });
  it('should have 2 separate decorators for text and date', () => {
    expect(textDecorator).not.toEqual(dateDecorator);
  });
});
