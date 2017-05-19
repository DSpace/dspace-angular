import { ProtractorPage } from './app.po';

describe('protractor App', function() {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display title "DSpace"', () => {
    page.navigateTo();
    expect(page.getPageTitleText()).toEqual('DSpace');
  });

  it('should display header "Welcome to DSpace"', () => {
    page.navigateTo();
    expect(page.getFirstHeaderText()).toEqual('Welcome to DSpace');
  });
});
