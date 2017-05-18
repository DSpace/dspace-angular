import { browser, element, by } from 'protractor';

export class ProtractorPage {
  navigateTo() {
    return browser.get('/');
  }

  getPageTitleText() {
    return browser.getTitle();
  }

  getFirstPText() {
    return element(by.xpath('//p[1]')).getText();
  }

  getFirstHeaderText() {
    return element(by.xpath('//h1[1]')).getText();
  }
}
