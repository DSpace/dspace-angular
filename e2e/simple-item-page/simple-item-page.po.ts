import { browser, element, by } from 'protractor';

export class ProtractorPage {
    ITEMPAGE : string = "/items/8766";

    navigateToSimpleItemPage() {
        return browser.get(this.ITEMPAGE);
    }

    elementTagExists(tag : string) {
        return element(by.tagName(tag)).isPresent();
    }

    elementSelectorExists(selector : string) {
        return element(by.css(selector)).isPresent();
    }


}