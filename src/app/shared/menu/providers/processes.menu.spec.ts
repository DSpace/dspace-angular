/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { MenuItemType } from '../menu-item-type.model';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { of as observableOf } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ProcessesMenuProvider } from './processes.menu';
import { PartialMenuSection } from '../menu-provider.model';

const expectedSections: PartialMenuSection[] = [
  {
    visible: true,
    model: {
      type: MenuItemType.LINK,
      text: 'menu.section.processes',
      link: '/processes',
    },
    icon: 'terminal',
  },
];

describe('ProcessesMenuProvider', () => {
  let provider: ProcessesMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      observableOf(true)
    );

    TestBed.configureTestingModule({
      providers: [
        ProcessesMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(ProcessesMenuProvider);
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
