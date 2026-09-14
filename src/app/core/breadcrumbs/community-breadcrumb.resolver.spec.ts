import { Community } from '../shared/community.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';
import { communityBreadcrumbResolver } from './community-breadcrumb.resolver';

describe('communityBreadcrumbResolver', () => {
  let breadcrumbService: any;
  let communityDataService: any;
  let community: Community;
  let parentCommunity: Community;
  let state: any;

  beforeEach(() => {
    community = Object.assign(new Community(), {
      uuid: '1234-65487-12354-1235',
      type: 'community',
    });
    parentCommunity = Object.assign(new Community(), {
      uuid: '4321-76548-45321-5321',
      type: 'community',
    });
    breadcrumbService = {};
    state = {};
    communityDataService = jasmine.createSpyObj('communityDataService', ['findById']);
    communityDataService.findById.and.callFake((uuid: string) =>
      createSuccessfulRemoteDataObject$(uuid === parentCommunity.uuid ? parentCommunity : community),
    );
  });

  it('should resolve the community from the route id', () => {
    const resolvedConfig = (communityBreadcrumbResolver as any)(
      { data: {}, params: { id: community.uuid }, queryParams: {} } as any,
      state,
      breadcrumbService,
      communityDataService,
    );

    let emitted = false;
    resolvedConfig.subscribe((config) => {
      emitted = true;
      expect(config).toEqual({
        provider: breadcrumbService,
        key: community,
        url: `/communities/${community.uuid}`,
      });
    });
    expect(emitted).toBeTrue();
    expect(communityDataService.findById.calls.mostRecent().args[0]).toEqual(community.uuid);
  });

  it('should resolve the parent community from the configured query parameter', () => {
    const resolvedConfig = (communityBreadcrumbResolver as any)(
      {
        data: { breadcrumbQueryParam: 'parent' },
        params: {},
        queryParams: { parent: parentCommunity.uuid },
      } as any,
      state,
      breadcrumbService,
      communityDataService,
    );

    let emitted = false;
    resolvedConfig.subscribe((config) => {
      emitted = true;
      expect(config).toEqual({
        provider: breadcrumbService,
        key: parentCommunity,
        url: `/communities/${parentCommunity.uuid}`,
      });
    });
    expect(emitted).toBeTrue();
    expect(communityDataService.findById.calls.mostRecent().args[0]).toEqual(parentCommunity.uuid);
  });

  it('should not request a community when the configured query parameter is absent', () => {
    const resolvedConfig = (communityBreadcrumbResolver as any)(
      { data: { breadcrumbQueryParam: 'parent' }, params: {}, queryParams: {} } as any,
      state,
      breadcrumbService,
      communityDataService,
    );

    let emitted = false;
    resolvedConfig.subscribe((config) => {
      emitted = true;
      expect(config).toBeUndefined();
    });
    expect(emitted).toBeTrue();
    expect(communityDataService.findById).not.toHaveBeenCalled();
  });
});
