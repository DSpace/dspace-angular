import { HrefOnlyDataService } from './href-only-data.service';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { DataService } from './data.service';
import { FindListOptions } from './find-list-options.model';

describe(`HrefOnlyDataService`, () => {
  let service: HrefOnlyDataService;
  let href: string;
  let spy: jasmine.Spy;
  let followLinks: FollowLinkConfig<any>[];
  let findListOptions: FindListOptions;

  beforeEach(() => {
    href = 'https://rest.api/server/api/core/items/de7fa215-4a25-43a7-a4d7-17534a09fdfc';
    followLinks = [ followLink('link1'), followLink('link2') ];
    findListOptions = new FindListOptions();
    service = new HrefOnlyDataService(null, null, null, null, null, null, null, null);
  });

  it(`should instantiate a private DataService`, () => {
    expect((service as any).dataService).toBeDefined();
    expect((service as any).dataService).toBeInstanceOf(DataService);
  });

    describe(`findByHref`, () => {
      beforeEach(() => {
        spy = spyOn((service as any).dataService, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(null));
      });

      it(`should delegate to findByHref on the internal DataService`, () => {
        service.findByHref(href, false, false, ...followLinks);
        expect(spy).toHaveBeenCalledWith(href, false, false, ...followLinks);
      });

      describe(`when useCachedVersionIfAvailable is omitted`, () => {
        it(`should call findByHref on the internal DataService with useCachedVersionIfAvailable = true`, () => {
            service.findByHref(href);
            expect(spy).toHaveBeenCalledWith(jasmine.anything(), true, jasmine.anything());
        });
      });

      describe(`when reRequestOnStale is omitted`, () => {
        it(`should call findByHref on the internal DataService with reRequestOnStale = true`, () => {
            service.findByHref(href);
            expect(spy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), true);
        });
      });
    });

    describe(`findAllByHref`, () => {
      beforeEach(() => {
        spy = spyOn((service as any).dataService, 'findAllByHref').and.returnValue(createSuccessfulRemoteDataObject$(null));
      });

      it(`should delegate to findAllByHref on the internal DataService`, () => {
        service.findAllByHref(href, findListOptions, false, false, ...followLinks);
        expect(spy).toHaveBeenCalledWith(href, findListOptions, false, false, ...followLinks);
      });

      describe(`when findListOptions is omitted`, () => {
        it(`should call findAllByHref on the internal DataService with findListOptions = {}`, () => {
            service.findAllByHref(href);
            expect(spy).toHaveBeenCalledWith(jasmine.anything(), {}, jasmine.anything(), jasmine.anything());
        });
      });

      describe(`when useCachedVersionIfAvailable is omitted`, () => {
        it(`should call findAllByHref on the internal DataService with useCachedVersionIfAvailable = true`, () => {
            service.findAllByHref(href);
            expect(spy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), true, jasmine.anything());
        });
      });

      describe(`when reRequestOnStale is omitted`, () => {
        it(`should call findAllByHref on the internal DataService with reRequestOnStale = true`, () => {
            service.findAllByHref(href);
            expect(spy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), true);
        });
      });
    });
});
