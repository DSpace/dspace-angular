
import { TestBed } from '@angular/core/testing';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { COLLECTION } from '@dspace/core/shared/collection.resource-type';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

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
        link: new URLCombiner('/collections/test-uuid/auditlogs').toString(),
      },
      icon: 'clipboard-check',
    },
  ];

  let provider: AuditLogsMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    type: COLLECTION.value,
    uuid: 'test-uuid',
    _links: { self: { href: 'self-link' } },
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'audit.context-menu-entry.enabled',
      values: [
        'true',
      ],
    })),
  });

  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      of(true),
    );
    TestBed.configureTestingModule({
      providers: [
        AuditLogsMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ],
    });
    provider = TestBed.inject(AuditLogsMenuProvider);
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
