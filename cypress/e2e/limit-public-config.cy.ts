describe('Limit public config properties', () => {
  it('Should not include cache.serverSide properties in the html source code',
    () => {
      cy.request('/').its('body').then((text: string) => {
        expect(text).to.not.contain('"serverSide":');
      });
    },
  );
  it('Should not include cache.serverSide properties in the config.json',
    () => {
      cy.request('/assets/config.json').its('body').then((obj: any) => {
        expect(obj.cache).to.not.haveOwnProperty('serverSide');
      });
    },
  );
});
