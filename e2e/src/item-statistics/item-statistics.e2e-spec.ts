import { ProtractorPage } from './item-statistics.po';
import { browser } from 'protractor';
import { UIURLCombiner } from '../../../src/app/core/url-combiner/ui-url-combiner';

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
    expect(browser.getCurrentUrl()).toEqual(new UIURLCombiner(page.ENTITYPAGE).toString());
    expect(browser.getCurrentUrl()).not.toEqual(new UIURLCombiner(page.ITEMSTATISTICSPAGE).toString());
    expect(browser.getCurrentUrl()).not.toEqual(new UIURLCombiner(page.ITEMPAGE).toString());
  });

  it('should contain element ds-item-statistics-page when navigating when navigating to an item statistics page', () => {
    page.navigateToItemStatisticsPage();
    expect<any>(page.elementTagExists('ds-item-statistics-page')).toEqual(true);
    expect<any>(page.elementTagExists('ds-item-page')).toEqual(false);
  });
  it('should contain the item statistics page url when navigating to an item statistics page', () => {
    page.navigateToItemStatisticsPage();
    expect(browser.getCurrentUrl()).toEqual(new UIURLCombiner(page.ITEMSTATISTICSPAGE).toString());
    expect(browser.getCurrentUrl()).not.toEqual(new UIURLCombiner(page.ENTITYPAGE).toString());
    expect(browser.getCurrentUrl()).not.toEqual(new UIURLCombiner(page.ITEMPAGE).toString());
  });
});
