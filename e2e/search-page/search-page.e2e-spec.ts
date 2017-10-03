import { ProtractorPage } from './search-page.po';

fdescribe('protractor SearchPage', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should contain query value when navigating to page with query parameter', () => {
    const queryString = 'Interesting query string';
    page.navigateToSearchWithQueryParameter(queryString);
    page.getCurrentQuery().then((query: string) => {
      expect<string>(query).toEqual(queryString);
    });
  });

  it('should not contain element ds-pagenotfound when navigating to existing page', () => {
    const scopeString = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
    page.navigateToSearchWithScopeParameter(scopeString);
    page.getCurrentScope().then((scope: string) => {
      expect<string>(scope).toEqual(scopeString);
    });
  });
});
