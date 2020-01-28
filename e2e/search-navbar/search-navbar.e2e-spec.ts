import { ProtractorPage } from './search-navbar.po';
import { browser } from 'protractor';

describe('protractor SearchNavbar', () => {
  let page: ProtractorPage;
  let queryString: string;

  beforeEach(() => {
    page = new ProtractorPage();
    queryString = 'the test query';
  });

  it('should go to search page with correct query if submitted (from home)', () => {
    page.navigateToHome();
    return checkIfSearchWorks();
  });

  it('should go to search page with correct query if submitted (from search)', () => {
    page.navigateToSearch();
    return checkIfSearchWorks();
  });

  it('check if can submit search box with pressing button', () => {
    page.navigateToHome();
    page.expandAndFocusSearchBox();
    page.setCurrentQuery(queryString);
    page.submitNavbarSearchForm();
    browser.wait(() => {
      return browser.getCurrentUrl().then((url: string) => {
        return url.indexOf('query=' + encodeURI(queryString)) !== -1;
      });
    });
  });

  function checkIfSearchWorks(): boolean {
    page.setCurrentQuery(queryString);
    page.submitByPressingEnter();
    browser.wait(() => {
      return browser.getCurrentUrl().then((url: string) => {
        return url.indexOf('query=' + encodeURI(queryString)) !== -1;
      });
    });
    return false;
  }

});
