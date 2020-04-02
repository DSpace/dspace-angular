import { browser, by, element, protractor } from 'protractor';
import { promise } from 'selenium-webdriver';

export class ProtractorPage {
  SEARCH = '/search';

  navigateToSearch() {
    return browser.get(this.SEARCH);
  }

  navigateToSearchWithQueryParameter(query: string) {
    return browser.get(this.SEARCH + '?query=' + query);
  }

  navigateToSearchWithScopeParameter(scope: string) {
    return browser.get(this.SEARCH + '?scope=' + scope);
  }

  getCurrentScope(): promise.Promise<string> {
    const scopeSelect = element(by.css('#search-form select'));
    browser.wait(protractor.ExpectedConditions.presenceOf(scopeSelect), 10000);
    return scopeSelect.getAttribute('value');
  }

  getCurrentQuery(): promise.Promise<string> {
    return element(by.css('#search-form input')).getAttribute('value');
  }

  setCurrentScope(scope: string) {
    return element(by.css('#search-form option[value="' + scope + '"]')).click();
  }

  setCurrentQuery(query: string) {
    element(by.css('#search-form input[name="query"]')).sendKeys(query);
  }

  submitSearchForm() {
    return element(by.css('#search-form button.search-button')).click();
  }

  getRandomScopeOption(): promise.Promise<string> {
    const options = element(by.css('select[name="scope"]')).all(by.tagName('option'));
    return options.count().then((c: number) => {
      const index: number = Math.floor(Math.random() * (c - 1));
      return options.get(index + 1).getAttribute('value');
    });
  }

  waitUntilNotLoading(): promise.Promise<unknown> {
    const loading = element(by.css('.loader'));
    const EC = protractor.ExpectedConditions;
    const notLoading = EC.not(EC.presenceOf(loading));
    return browser.wait(notLoading, 10000);
  }
}
