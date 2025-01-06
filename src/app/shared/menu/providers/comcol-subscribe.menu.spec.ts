import { PartialMenuSection } from '../menu-provider.model';
import { MenuItemType } from '../menu-item-type.model';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscribeMenuProvider } from './comcol-subscribe.menu';
import { Collection } from '../../../core/shared/collection.model';

describe('SubscribeMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'subscriptions.tooltip',
        function: jasmine.any(Function) as any,
      },
      icon: 'bell',
    }
  ];

  let provider: SubscribeMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {_links: {self: {href: 'self-link'}}});


  let authorizationService;
  let modalService;

  beforeEach(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': observableOf(true)
    });

    modalService = jasmine.createSpyObj('modalService', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SubscribeMenuProvider,
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: NgbModal, useValue: modalService},
      ],
    });
    provider = TestBed.inject(SubscribeMenuProvider);
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
