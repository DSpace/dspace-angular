import { browser, element, by } from 'protractor';

export class ProtractorPage {
  HOMEPAGE : string = "/home";
  NONEXISTINGPAGE : string = "/e9019a69-d4f1-4773-b6a3-bd362caa46f2";

  navigateToRandomPage() {
    return browser.get(this.NONEXISTINGPAGE);
  }
  navigateToHomePage() {
    return browser.get(this.HOMEPAGE);
  }

  elementTagExists(tag : string) {
    return element(by.tagName(tag)).isPresent();
  }


}