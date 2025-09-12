import { LinkService } from '../cache/builders/link.service';

export function getMockLinkService(): LinkService {
  return jasmine.createSpyObj('linkService', {
    resolveLinks: jasmine.createSpy('resolveLinks'),
    resolveLink: jasmine.createSpy('resolveLink'),
    removeResolvedLinks: jasmine.createSpy('removeResolvedLinks'),
  });
}
