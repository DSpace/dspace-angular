import { LinkService } from '../../core/cache/builders/link.service';

export function getMockLinkService(): LinkService {
  return jasmine.createSpyObj('linkService', {
    resolveLinks: jasmine.createSpy('resolveLinks'),
    resolveLink: jasmine.createSpy('resolveLink'),
    resolveLinkWithoutAttaching: jasmine.createSpy('resolveLinkWithoutAttaching'),
    removeResolvedLinks: jasmine.createSpy('removeResolvedLinks'),
  });
}
