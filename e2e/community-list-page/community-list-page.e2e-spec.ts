import { CommunityListPageProtractor } from './community-list-page.po';

describe('protractor CommunityListPage', () => {
  let page: CommunityListPageProtractor;

  beforeEach(() => {
    page = new CommunityListPageProtractor();
  });

  it('should contain page-limited top communities (at least 1 expandable community)', () => {
    page.navigateToCommunityList();
    expect<any>(page.anExpandableCommunityIsPresent()).toEqual(true)
  });

  describe('if expanded a node and navigating away, tree state gets saved', () => {
    it('if navigating back, same node is expanded', () => {
      page.navigateToCommunityList();
      const linkOfSecondNodeBeforeExpanding = page.getLinkOfSecondNode();
      page.toggleExpandFirstExpandableCommunity();
      const linkOfSecondNodeAfterExpanding = page.getLinkOfSecondNode();
      page.navigateToHome();
      page.navigateToCommunityList();
      expect<any>(page.getLinkOfSecondNode()).toEqual(linkOfSecondNodeAfterExpanding);
      page.toggleExpandFirstExpandableCommunity();
      expect<any>(page.getLinkOfSecondNode()).toEqual(linkOfSecondNodeBeforeExpanding);
    });
  });
});
