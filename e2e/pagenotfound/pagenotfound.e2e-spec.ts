import { ProtractorPage } from './pagenotfound.po';

describe('protractor PageNotFound', function() {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should contain element ds-pagenotfound when navigating to page that doesnt exist"', () => {
    page.navigateToRandomPage();
    expect(page.elementTagExists("ds-pagenotfound")).toEqual(true);
  });

  it('should contain element ds-home when navigating to /home"', () => {
    page.navigateToHomePage();
    expect(page.elementTagExists("ds-home")).toEqual(true);
  });
});
