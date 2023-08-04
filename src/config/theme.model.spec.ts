import { HandleTheme, RegExTheme, Theme, UUIDTheme } from '../app/shared/theme-support/theme.model';
import { getCommunityModuleRoute } from '../app/community-page/community-page-routing-paths';
import { Community } from '../app/core/shared/community.model';
import { COMMUNITY } from '../app/core/shared/community.resource-type';
import { getCollectionModuleRoute } from '../app/collection-page/collection-page-routing-paths';
import { COLLECTION } from '../app/core/shared/collection.resource-type';
import { Collection } from '../app/core/shared/collection.model';
import { Item } from '../app/core/shared/item.model';
import { ITEM } from '../app/core/shared/item.resource-type';
import { getItemModuleRoute } from '../app/item-page/item-page-routing-paths';
import { HandleService } from '../app/shared/handle.service';

describe('Theme Models', () => {
  let theme: Theme;

  describe('RegExTheme', () => {
    it('should return true when the regex matches the community\'s DSO route', (done: DoneFn) => {
      theme = new RegExTheme({
        name: 'community',
        regex: getCommunityModuleRoute() + '/.*',
      });
      const dso = Object.assign(new Community(), {
        type: COMMUNITY.value,
        uuid: 'community-uuid',
      });
      theme.matches('', dso).subscribe((matches: boolean) => {
        expect(matches).toBeTrue();
        done();
      });
    });

    it('should return true when the regex matches the collection\'s DSO route', (done: DoneFn) => {
      theme = new RegExTheme({
        name: 'collection',
        regex: getCollectionModuleRoute() + '/.*',
      });
      const dso = Object.assign(new Collection(), {
        type: COLLECTION.value,
        uuid: 'collection-uuid',
      });
      theme.matches('', dso).subscribe((matches: boolean) => {
        expect(matches).toBeTrue();
        done();
      });
    });

    it('should return true when the regex matches the item\'s DSO route', (done: DoneFn) => {
      theme = new RegExTheme({
        name: 'item',
        regex: getItemModuleRoute() + '/.*',
      });
      const dso = Object.assign(new Item(), {
        type: ITEM.value,
        uuid: 'item-uuid',
      });
      theme.matches('', dso).subscribe((matches: boolean) => {
        expect(matches).toBeTrue();
        done();
      });
    });

    it('should return true when the regex matches the url', (done: DoneFn) => {
      theme = new RegExTheme({
        name: 'url',
        regex: '.*partial.*',
      });
      theme.matches('theme/partial/url/match', null).subscribe((matches: boolean) => {
        expect(matches).toBeTrue();
        done();
      });
    });

    it('should return false when the regex matches neither the url, nor the DSO route', (done: DoneFn) => {
      theme = new RegExTheme({
        name: 'no-match',
        regex: '.*no/match.*',
      });
      theme.matches('theme/partial/url/match', null).subscribe((matches: boolean) => {
        expect(matches).toBeFalse();
        done();
      });
    });
  });

  describe('HandleTheme', () => {
    let handleService;
    beforeEach(() => {
      handleService = new HandleService();
      });
    it('should return true when the DSO\'s handle matches the theme\'s handle', () => {
      theme = new HandleTheme({
        name: 'matching-handle',
        handle: '1234/5678',
      }, handleService);
      const matchingDso = Object.assign(new Item(), {
        type: ITEM.value,
        uuid: 'item-uuid',
        handle: '1234/5678',
      }, handleService);
      expect(theme.matches('', matchingDso)).toEqual(true);
    });
    it('should return false when the DSO\'s handle contains the theme\'s handle as a subpart', () => {
      theme = new HandleTheme({
        name: 'matching-handle',
        handle: '1234/5678',
      }, handleService);
      const dso = Object.assign(new Item(), {
        type: ITEM.value,
        uuid: 'item-uuid',
        handle: '1234/567891011',
      });
      expect(theme.matches('', dso)).toEqual(false);
    });

    it('should return false when the handles don\'t match', (done: DoneFn) => {
      theme = new HandleTheme({
        name: 'no-matching-handle',
        handle: '1234/5678',
      }, handleService);
      const dso = Object.assign(new Item(), {
        type: ITEM.value,
        uuid: 'item-uuid',
        handle: '1234/6789',
      });
      theme.matches('', dso).subscribe((matches: boolean) => {
        expect(matches).toBeFalse();
        done();
      });
    });
  });

  describe('UUIDTheme', () => {
    it('should return true when the DSO\'s UUID matches the theme\'s UUID', (done: DoneFn) => {
      theme = new UUIDTheme({
        name: 'matching-uuid',
        uuid: 'item-uuid',
      });
      const dso = Object.assign(new Item(), {
        type: ITEM.value,
        uuid: 'item-uuid',
      });
      theme.matches('', dso).subscribe((matches: boolean) => {
        expect(matches).toBeTrue();
        done();
      });
    });

    it('should return true when the UUIDs don\'t match', (done: DoneFn) => {
      theme = new UUIDTheme({
        name: 'matching-uuid',
        uuid: 'item-uuid',
      });
      const dso = Object.assign(new Collection(), {
        type: COLLECTION.value,
        uuid: 'collection-uuid',
      });
      theme.matches('', dso).subscribe((matches: boolean) => {
        expect(matches).toBeFalse();
        done();
      });
    });
  });
});
