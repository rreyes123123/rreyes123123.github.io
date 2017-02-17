import { FacebookProjectPage } from './app.po';

describe('facebook-project App', function() {
  let page: FacebookProjectPage;

  beforeEach(() => {
    page = new FacebookProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
