import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { COLLECTION } from '@dspace/core/shared/collection.resource-type';
import {
  Observable,
  of,
} from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { SubmitNewItemMenuProvider } from './submit-new-item.menu';

describe('SubmitNewItemMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'collection.submit.item',
        link: '/submit',
        queryParams: {
          collection: 'test-uuid',
        },
      },
      icon: 'plus',
    },
  ];

  let provider: SubmitNewItemMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    type: COLLECTION.value,
    uuid: 'test-uuid',
    _links: { self: { href: 'self-link' } },
  });


  let authorizationService: { isAuthorized: Observable<boolean> ; };

  beforeEach(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': of(true),
    });

    TestBed.configureTestingModule({
      providers: [
        SubmitNewItemMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: APP_CONFIG, useValue: environment },
      ],
    });
    provider = TestBed.inject(SubmitNewItemMenuProvider);
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

    it('should set visibility depending on authorization and collection.showSubmitButton', done => {
      provider.getSectionsForContext(dso).subscribe((sections) => {
        expect(sections[0].visible).toEqual(authorizationService.isAuthorized && !environment.collection.showSubmitButton);
        done();
      });
    });
  });
});
