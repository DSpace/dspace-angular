import { ProtractorPage } from './app.po';

describe('protractor App', function() {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
