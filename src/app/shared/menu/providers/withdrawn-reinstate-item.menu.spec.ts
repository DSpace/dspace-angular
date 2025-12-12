import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { CorrectionTypeDataService } from '../../../core/submission/correctiontype-data.service';
import { CorrectionType } from '../../../core/submission/models/correctiontype.model';
import {
  DsoWithdrawnReinstateModalService,
  REQUEST_WITHDRAWN,
} from '../../dso-page/dso-withdrawn-reinstate-service/dso-withdrawn-reinstate-modal.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { OnClickMenuItemModel } from '../menu-item/models/onclick.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { WithdrawnReinstateItemMenuProvider } from './withdrawn-reinstate-item.menu';

describe('WithdrawnReinstateItemMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'item.page.withdrawn',
        function: jasmine.any(Function) as any,
      } as OnClickMenuItemModel,
      icon: 'eye-slash',
    },
    {
      visible: false,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'item.page.reinstate',
        function: jasmine.any(Function) as any,

      } as OnClickMenuItemModel,
      icon: 'eye',
    },
  ];

  let provider: WithdrawnReinstateItemMenuProvider;

  const item: Item = Object.assign(new Item(), {
    type: ITEM.value,
    isArchived: true,
    isWithdrawn: false,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item',
      }],
    },
  });

  let correctionTypeDataService;
  let dsoWithdrawnReinstateModalService;

  beforeEach(() => {
    const correctionType = Object.assign(new CorrectionType(), {
      topic: REQUEST_WITHDRAWN,
    });
    const correctionRD = createSuccessfulRemoteDataObject$(createPaginatedList([correctionType]));

    correctionTypeDataService = jasmine.createSpyObj('correctionTypeDataService', {
      'findByItem': correctionRD,
    });

    dsoWithdrawnReinstateModalService = jasmine.createSpyObj('dsoWithdrawnReinstateModalService', ['openCreateWithdrawnReinstateModal']);


    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        WithdrawnReinstateItemMenuProvider,
        { provide: CorrectionTypeDataService, useValue: correctionTypeDataService },
        { provide: DsoWithdrawnReinstateModalService, useValue: dsoWithdrawnReinstateModalService },
      ],
    });
    provider = TestBed.inject(WithdrawnReinstateItemMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the expected sections', (done) => {
      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });
});
