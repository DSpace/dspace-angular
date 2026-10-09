import { LinkService } from '../cache/builders/link.service';

/**
 * Create a mock {@link LinkService}.
 * <p>
 * {@code resolveLink} / {@code resolveLinks} return the given model by default, matching the real
 * service contract (callers assign the return value). Tests can still override these spies.
 */
export function getMockLinkService(): LinkService {
  const linkService = jasmine.createSpyObj('linkService', [
    'resolveLinks',
    'resolveLink',
    'resolveLinkWithoutAttaching',
    'removeResolvedLinks',
  ]);
  linkService.resolveLinks.and.callFake((object) => object);
  linkService.resolveLink.and.callFake((object) => object);
  return linkService;
}
