/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app.config';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AuditOverviewMenuProvider } from './audit-overview.menu';

describe('AuditOverviewMenuProvider', () => {
  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.audit',
        link: '/auditlogs',
      },
      icon: 'clipboard-check',
    },
  ];

  let provider: AuditOverviewMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();
  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'audit.enabled',
      values: [
        'true',
      ],
    })),
  });

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      of(true),
    );

    TestBed.configureTestingModule({
      providers: [
        AuditOverviewMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: APP_CONFIG, useValue: environment },
      ],
    });
    provider = TestBed.inject(AuditOverviewMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getSections should return expected menu sections', (done) => {
    provider.getSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSections);
      done();
    });
  });
});
