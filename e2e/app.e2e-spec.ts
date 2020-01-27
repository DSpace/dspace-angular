import { by, element } from 'protractor';
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

  it('should contain a news section', () => {
    page.navigateTo()
      .then(() => element(by.css('.main-content')).getAttribute('innerHTML').then((v) => process.stdout.write(v)));
    expect<any>(page.getHomePageNewsText()).toBeDefined();
  });
});
