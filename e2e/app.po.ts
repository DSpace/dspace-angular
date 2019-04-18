import { browser, element, by } from 'protractor';

export class ProtractorPage {
  navigateTo() {
    return browser.get('/');
  }

  getPageTitleText() {
    return browser.getTitle();
  }

  getHomePageNewsText() {
    return element(by.xpath('//ds-home-news')).getText();
  }
}
