import { browser, element, by } from 'protractor';

export class ProtractorPage {
  ITEMPAGE = '/items/e98b0f27-5c19-49a0-960d-eb6ad5287067';
  ENTITYPAGE = '/entities/publication/e98b0f27-5c19-49a0-960d-eb6ad5287067';
  ITEMSTATISTICSPAGE = '/statistics/items/e98b0f27-5c19-49a0-960d-eb6ad5287067';

  navigateToItemPage() {
    return browser.get(this.ITEMPAGE);
  }
  navigateToItemStatisticsPage() {
    return browser.get(this.ITEMSTATISTICSPAGE);
  }

  elementTagExists(tag: string) {
    return element(by.tagName(tag)).isPresent();
  }
}
