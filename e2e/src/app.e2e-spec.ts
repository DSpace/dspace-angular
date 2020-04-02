import { ProtractorPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

describe('protractor App', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display translated title "DSpace Angular :: Home"', () => {
    page.navigateTo()
      .then(() => page.waitUntilNotLoading())
      .then(() => {
          expect<any>(page.getPageTitleText()).toEqual('DSpace Angular :: Home');
        }
      )
    ;
  });

  it('should contain a news section', () => {
    page.navigateTo()
      .then(() => page.waitUntilNotLoading())
      .then(() => page.getHomePageNewsText())
      .then((text) => expect<any>(text).toBeDefined());
  });
});
