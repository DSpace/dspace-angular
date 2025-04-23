/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { ConfigurationDataServiceStub } from '../../testing/configuration-data.service.stub';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { CreateReportMenuProvider } from './create-report.menu';

describe('CreateReportMenuProvider', () => {
  const expectedTopSection: PartialMenuSection = {
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.reports',
    } as TextMenuItemModel,
    icon: 'file-alt',
  };

  const expectedSubSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.reports.collections',
        link: '/admin/reports/collections',
      } as LinkMenuItemModel,
      icon: 'user-check',
    },
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.reports.queries',
        link: '/admin/reports/queries',
      } as LinkMenuItemModel,
      icon: 'user-check',
    },
  ];

  let provider: CreateReportMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();
  let configurationDataService = new ConfigurationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.callFake((id: FeatureID) => {
      if (id === FeatureID.AdministratorOf) {
        return of(true);
      } else {
        return of(false);
      }
    });

    spyOn(configurationDataService, 'findByPropertyName').and.callFake((property: string) => {
      return createSuccessfulRemoteDataObject$(Object.assign({}, new ConfigurationProperty(), { values: ['true'] }));
    });

    TestBed.configureTestingModule({
      providers: [
        CreateReportMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ],
    });
    provider = TestBed.inject(CreateReportMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getTopSection should return expected menu section', (done) => {
    provider.getTopSection().subscribe((section) => {
      expect(section).toEqual(expectedTopSection);
      done();
    });
  });

  it('getSubSections should return expected menu sections', (done) => {
    provider.getSubSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSubSections);
      done();
    });
  });
});
