import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { DsoVersioningModalService } from '../../dso-page/dso-versioning-modal-service/dso-versioning-modal.service';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { VersioningMenuProvider } from './item-versioning.menu';

describe('VersioningMenuProvider', () => {

  const expectedSectionsWhenVersionNotPresent: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'item.page.version.create',
        disabled: false,
        function: jasmine.any(Function) as any,
      },
      icon: 'code-branch',
    },
  ];
  const expectedSectionsWhenVersionPresent: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'item.page.version.hasDraft',
        disabled: true,
        function: jasmine.any(Function) as any,
      },
      icon: 'code-branch',
    },
  ];

  let provider: VersioningMenuProvider;

  const item: Item = Object.assign(new Item(), {
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item',
      }],
    },
  });


  let authorizationService;
  let dsoVersioningModalService;

  beforeEach(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    dsoVersioningModalService = jasmine.createSpyObj('dsoVersioningModalService', {
      isNewVersionButtonDisabled: of(false),
      getVersioningTooltipMessage: of('item.page.version.create'),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        VersioningMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: DsoVersioningModalService, useValue: dsoVersioningModalService },
      ],
    });
    provider = TestBed.inject(VersioningMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the section to create a new version when no version draft is present yet', (done) => {
      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedSectionsWhenVersionNotPresent);
        done();
      });
    });
    it('should return the section to that a version is present when a version draft is present', (done) => {
      (dsoVersioningModalService.isNewVersionButtonDisabled as jasmine.Spy).and.returnValue(of(true));
      (dsoVersioningModalService.getVersioningTooltipMessage as jasmine.Spy).and.returnValue(of('item.page.version.hasDraft'));

      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedSectionsWhenVersionPresent);
        done();
      });
    });
  });

});
