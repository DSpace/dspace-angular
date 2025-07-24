
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { COLLECTION } from '../../../core/shared/collection.resource-type';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
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
        link: new URLCombiner('/auditlogs/object/test-uuid').toString(),
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

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'context-menu-entry.audit.enabled',
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
