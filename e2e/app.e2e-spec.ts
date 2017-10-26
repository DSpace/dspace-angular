import { ProtractorPage } from './app.po';

describe('protractor App', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display translated title "DSpace Angular :: Home"', () => {
    page.navigateTo();
    expect<any>(page.getPageTitleText()).toEqual('DSpace Angular :: Home');
  });

  it('should display header "Welcome to DSpace"', () => {
    page.navigateTo();
    expect<any>(page.getFirstHeaderText()).toEqual('Welcome to DSpace');
  });
});
