import { browser, by, element } from 'protractor';

export class ProtractorPage {
  navigateTo() {
    return browser.get('/')
      .then(() => browser.waitForAngular());
  }

  getPageTitleText() {
    return browser.getTitle();
  }

  getHomePageNewsText() {
    return element(by.xpath('//ds-home-news')).getText();
  }
}
