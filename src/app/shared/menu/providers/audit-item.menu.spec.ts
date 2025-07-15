
import { Collection } from '../../../core/shared/collection.model';
import { COLLECTION } from '../../../core/shared/collection.resource-type';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AuditLogsMenuProvider } from './audit-item.menu';

describe('AuditLogsMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'context-menu.actions.audit-item.btn',
        link: new URLCombiner('/auditlogs/object').toString(),
      },
      icon: 'key',
    },
  ];

  let provider: AuditLogsMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    type: COLLECTION.value,
    uuid: 'test-uuid',
    _links: { self: { href: 'self-link' } },
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the expected sections', (done) => {
      provider.getSectionsForContext(dso).subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });


});
