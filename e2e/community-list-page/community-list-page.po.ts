import { browser, by, element, protractor } from 'protractor';

export class CommunityListPageProtractor {
  HOMEPAGE = '/home';
  COMMUNITY_LIST = '/community-list';

  navigateToHome() {
    return browser.get(this.HOMEPAGE);
  }

  navigateToCommunityList() {
    browser.get(this.COMMUNITY_LIST);
    const loading = element(by.css('.ds-loading'));
    browser.wait(protractor.ExpectedConditions.invisibilityOf(loading), 10000);
    return;

  }

  anExpandableCommunityIsPresent() {
    console.log(element(by.css('body')));
    return element(by.css('.expandable-node h5 a')).isPresent();
  }

  toggleExpandFirstExpandableCommunity() {
    element(by.css('.expandable-node button')).click();
  }

  getLinkOfSecondNode() {
    return element(by.css('.cdk-tree-node h5 a')).getAttribute('href');
  }

}
