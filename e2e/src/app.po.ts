import { browser, element, by, protractor, promise } from 'protractor';

export class ProtractorPage {
  navigateTo() {
    return browser.get('/')
      .then(() => browser.waitForAngular());
  }

  getPageTitleText() {
    return browser.getTitle();
  }

  getHomePageNewsText() {
    return element(by.css('ds-home-news')).getText();
  }

  waitUntilNotLoading(): promise.Promise<unknown> {
    const loading = element(by.css('.loader'))
    const EC = protractor.ExpectedConditions;
    const notLoading = EC.not(EC.presenceOf(loading));
    return browser.wait(notLoading, 10000);
  }
}
