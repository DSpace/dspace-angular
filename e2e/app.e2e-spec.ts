import { ProtractorPage } from './app.po';

describe('protractor App', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display translated title "DSpace Cris Angular :: Home"', () => {
    page.navigateTo();
    expect<any>(page.getPageTitleText()).toEqual('DSpace Cris Angular :: Home');
  });

  it('should contain a news section', () => {
    page.navigateTo()
      .then(() => expect<any>(page.getHomePageNewsText()).toBeDefined());
  });
});
