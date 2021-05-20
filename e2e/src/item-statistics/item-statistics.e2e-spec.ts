import { ProtractorPage } from './item-statistics.po';
import { browser } from 'protractor';

describe('protractor Item statics', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should contain element ds-item-page when navigating when navigating to an item page', () => {
    page.navigateToItemPage();
    expect<any>(page.elementTagExists('ds-item-page')).toEqual(true);
    expect<any>(page.elementTagExists('ds-item-statistics-page')).toEqual(false);
  });

  it('should redirect to the entity page when navigating to an item page', () => {
    page.navigateToItemPage();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000' + page.ENTITYPAGE);
  });

  it('should contain element ds-item-statistics-page when navigating when navigating to an item statistics page', () => {
    page.navigateToItemStatisticsPage();
    expect<any>(page.elementTagExists('ds-item-statistics-page')).toEqual(true);
    expect<any>(page.elementTagExists('ds-item-page')).toEqual(false);
  });
  it('should contain the item statistics page url when navigating to an item statistics page', () => {
    page.navigateToItemStatisticsPage();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000' + page.ITEMSTATISTICSPAGE);
  });
});
