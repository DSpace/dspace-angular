import { browser, by, element } from 'protractor';

export class CommunityListPageProtractor {
  HOMEPAGE = '/home';
  COMMUNITY_LIST = '/community-list';

  navigateToHome() {
    return browser.get(this.HOMEPAGE);
  }

  navigateToCommunityList() {
    return browser.get(this.COMMUNITY_LIST);
  }

  anExpandableCommunityIsPresent() {
    return element(by.css('.expandable-node h5 a')).isPresent();
  }

  toggleExpandFirstExpandableCommunity() {
    element(by.css('.expandable-node button')).click();
  }

  getLinkOfSecondNode() {
    return element(by.css('.cdk-tree-node h5 a')).getAttribute('href');
  }

}
