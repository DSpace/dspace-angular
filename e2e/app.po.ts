import { browser, by, element } from 'protractor';

export class ProtractorPage {
  navigateTo() {
    // return browser.get('/');
    return browser.get('/')
      .then(() => browser.getPageSource())
      .then((txt) => {console.log(txt.substring(txt.indexOf('<body>')));});
  }

  getPageTitleText() {
    return browser.getTitle();
  }

  getHomePageNewsText() {
    return element(by.xpath('//ds-home-news')).getText();
  }
}
