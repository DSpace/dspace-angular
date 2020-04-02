import { ProtractorPage } from './app.po';
import { by, element } from 'protractor';

describe('protractor App', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display translated title "DSpace Angular :: Home"', () => {
    page.navigateTo()
      .then(() => {
          element(by.css('.main-content')).getAttribute('innerHTML').then((v) => process.stdout.write(v));
          expect<any>(page.getPageTitleText()).toEqual('DSpace Angular :: Home');
        }
      );
  });

  it('should contain a news section', () => {
    page.navigateTo()
      .then(() =>
        page.getHomePageNewsText().then((text) => expect<any>(text).toBeDefined()));
  });
});
