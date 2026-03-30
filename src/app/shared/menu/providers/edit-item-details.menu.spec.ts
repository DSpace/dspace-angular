/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { EditItemDataService } from '@dspace/core/submission/edititem-data.service';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { cold } from 'jasmine-marbles';

import { MenuItemType } from '../menu-item-type.model';
import { EditItemMenuProvider } from './edit-item-details.menu';

describe('EditItemMenuProvider', () => {

  let provider: EditItemMenuProvider;

  const editItemServiceStub = jasmine.createSpyObj('EditItemDataService', [
    'searchEditModesById',
  ]);

  const mockDSO = {
    id: 'test-id',
    uuid: 'test-uuid',
  } as DSpaceObject;

  const mockEditModes = [
    { name: 'quickedit' },
    { name: 'full' },
  ];

  const expectedSections = [
    {
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.quickedit',
        link: jasmine.any(String),
      },
      icon: 'pencil-alt',
      visible: true,
    },
    {
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.full',
        link: jasmine.any(String),
      },
      icon: 'pencil-alt',
      visible: true,
    },
  ];

  beforeEach(() => {

    editItemServiceStub.searchEditModesById.and.returnValue(
      createSuccessfulRemoteDataObject$(
        createPaginatedList(mockEditModes),
      ),
    );

    TestBed.configureTestingModule({
      providers: [
        EditItemMenuProvider,
        { provide: EditItemDataService, useValue: editItemServiceStub },
      ],
    });

    provider = TestBed.inject(EditItemMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('should return menu sections', () => {

    const result = provider.getSectionsForContext(mockDSO);

    const expected = cold('(a|)', {
      a: expectedSections,
    });

    expect(result).toBeObservable(expected);
  });

});
