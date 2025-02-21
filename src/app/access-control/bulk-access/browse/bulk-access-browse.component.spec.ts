import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  NgbAccordionModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { buildPaginatedList } from '../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { PageInfo } from '../../../../../modules/core/src/lib/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { getMockThemeService } from '../../../shared/mocks/theme-service.mock';
import { ListableObjectComponentLoaderComponent } from '../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { SelectableListItemControlComponent } from '../../../shared/object-collection/shared/selectable-list-item-control/selectable-list-item-control.component';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { SelectableObject } from '../../../shared/object-list/selectable-list/selectable-list.service.spec';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ThemedSearchComponent } from '../../../shared/search/themed-search.component';
import { ThemeService } from '../../../shared/theme-support/theme.service';
import { BulkAccessBrowseComponent } from './bulk-access-browse.component';

describe('BulkAccessBrowseComponent', () => {
  let component: BulkAccessBrowseComponent;
  let fixture: ComponentFixture<BulkAccessBrowseComponent>;

  const listID1 = 'id1';
  const value1 = 'Selected object';
  const value2 = 'Another selected object';

  const selected1 = new SelectableObject(value1);
  const selected2 = new SelectableObject(value2);

  const testSelection = { id: listID1, selection: [selected1, selected2] };

  const selectableListService = jasmine.createSpyObj('SelectableListService', ['getSelectableList', 'deselectAll']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbAccordionModule,
        NgbNavModule,
        TranslateModule.forRoot(),
        BulkAccessBrowseComponent,
      ],
      providers: [
        { provide: SelectableListService, useValue: selectableListService },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(BulkAccessBrowseComponent, {
        remove: {
          imports: [
            PaginationComponent,
            ThemedSearchComponent,
            SelectableListItemControlComponent,
            ListableObjectComponentLoaderComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAccessBrowseComponent);
    component = fixture.componentInstance;
    (component as any).selectableListService.getSelectableList.and.returnValue(of(testSelection));
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an initial active nav id of "search"', () => {
    expect(component.activateId).toEqual('search');
  });

  it('should have an initial pagination options object with default values', () => {
    expect(component.paginationOptions$.getValue().id).toEqual('bas');
    expect(component.paginationOptions$.getValue().pageSize).toEqual(5);
    expect(component.paginationOptions$.getValue().currentPage).toEqual(1);
  });

  it('should have an initial remote data with a paginated list as value', () => {
    const list = buildPaginatedList(new PageInfo({
      'elementsPerPage': 5,
      'totalElements': 2,
      'totalPages': 1,
      'currentPage': 1,
    }), [selected1, selected2]);
    const rd = createSuccessfulRemoteDataObject(list);

    expect(component.objectsSelected$.value).toEqual(rd);
  });

});
