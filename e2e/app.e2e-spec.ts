import { ProtractorPage } from './app.po';

describe('protractor App', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display title "DSpace"', () => {
    page.navigateTo();
    expect<any>(page.getPageTitleText()).toEqual('DSpace');
  });

  it('should display header "Welcome to DSpace"', () => {
    page.navigateTo();
    expect<any>(page.getFirstHeaderText()).toEqual('Welcome to DSpace');
  });
});
