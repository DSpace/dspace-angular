import {Community} from './community.model';

fdescribe('Community', () => {

  fdescribe('Community handle value',  () => {

    let metadataValue;
    let handleValue;

    beforeEach(() => {
      metadataValue = {'dc.identifier.uri': [ { value: '123456789/1'}]};
      handleValue = '11111111111/1';
    })

    it('should return the handle value from metadata', () => {
      const community = Object.assign(new Community(), { metadata: metadataValue });
      expect(community.handle).toEqual('123456789/1');
    });

    it('should return the handle value from metadata even when the handle field is provided', () => {
      const community = Object.assign(new Community(), { handle: handleValue, metadata: metadataValue });
      expect(community.handle).toEqual('123456789/1');
    });

    it('should return undefined if the handle value from metadata is not present', () => {
      const community = Object.assign(new Community(), { handle: handleValue });
      expect(community.handle).toEqual(undefined);
    });
  });

});
