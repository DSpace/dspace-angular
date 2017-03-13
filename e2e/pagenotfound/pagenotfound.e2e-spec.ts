import { ProtractorPage } from './pagenotfound.po';

describe('protractor PageNotFound', function() {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should contain element ds-pagenotfound when navigating to page that doesnt exist"', () => {
    page.navigateToNonExistingPage();
    expect(page.elementTagExists("ds-pagenotfound")).toEqual(true);
  });

  it('should not contain element ds-pagenotfound when navigating to existing page"', () => {
    page.navigateToExistingPage();
    expect(page.elementTagExists("ds-pagenotfound")).toEqual(false);
  });
});
