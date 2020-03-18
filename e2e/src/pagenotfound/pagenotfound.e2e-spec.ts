import { ProtractorPage } from './pagenotfound.po';

describe('protractor PageNotFound', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should contain element ds-pagenotfound when navigating to page that doesnt exist', () => {
    page.navigateToNonExistingPage();
    expect<any>(page.elementTagExists('ds-pagenotfound')).toEqual(true);
  });

  it('should not contain element ds-pagenotfound when navigating to existing page', () => {
    page.navigateToExistingPage();
    expect<any>(page.elementTagExists('ds-pagenotfound')).toEqual(false);
  });
});
