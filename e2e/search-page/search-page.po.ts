import { browser, element, by } from 'protractor';
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
    return element(by.tagName('select')).getAttribute('value');
  }

  getCurrentQuery(): promise.Promise<string>  {
    return element(by.tagName('input')).getAttribute('value');
  }

  elementTagExists(tag: string) {
    return element(by.tagName(tag)).isPresent();
  }

}
