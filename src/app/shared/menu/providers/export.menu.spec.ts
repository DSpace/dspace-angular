/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { ScriptServiceStub } from '../../testing/script-service.stub';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { ExportMenuProvider } from './export.menu';

describe('ExportMenuProvider', () => {
  const expectedTopSection: PartialMenuSection = {
    accessibilityHandle: 'export',
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.export',
    },
    icon: 'file-export',
  };

  const expectedSubSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.export_metadata',
        function: jasmine.any(Function) as any,
      },
    },
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.export_batch',
        function: jasmine.any(Function) as any,
      },
    },
  ];

  let provider: ExportMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      of(true),
    );

    TestBed.configureTestingModule({
      providers: [
        ExportMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
        { provide: ScriptDataService, useClass: ScriptServiceStub },
      ],
    });
    provider = TestBed.inject(ExportMenuProvider);
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
