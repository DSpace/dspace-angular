import { browser, by, element, protractor } from 'protractor';
import { promise } from 'selenium-webdriver';

export class ProtractorPage {
  HOME = '/home';
  SEARCH = '/search';

  navigateToHome() {
    return browser.get(this.HOME);
  }

  navigateToSearch() {
    return browser.get(this.SEARCH);
  }

  getCurrentQuery(): promise.Promise<string> {
    return element(by.css('#search-navbar-container form input')).getAttribute('value');
  }

  expandAndFocusSearchBox() {
    element(by.css('#search-navbar-container form a')).click();
  }

  setCurrentQuery(query: string) {
    element(by.css('#search-navbar-container form input[name="query"]')).sendKeys(query);
  }

  submitNavbarSearchForm() {
    element(by.css('#search-navbar-container form .submit-icon')).click();
  }

  submitByPressingEnter() {
    element(by.css('#search-navbar-container form input[name="query"]')).sendKeys(protractor.Key.ENTER);
  }
}
