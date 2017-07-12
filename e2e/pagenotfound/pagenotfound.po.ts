import { browser, element, by } from 'protractor';

export class ProtractorPage {
  HOMEPAGE = '/home';
  NONEXISTINGPAGE = '/e9019a69-d4f1-4773-b6a3-bd362caa46f2';

  navigateToNonExistingPage() {
    return browser.get(this.NONEXISTINGPAGE);
  }
  navigateToExistingPage() {
    return browser.get(this.HOMEPAGE);
  }

  elementTagExists(tag: string) {
    return element(by.tagName(tag)).isPresent();
  }

}
