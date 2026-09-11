import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { ListableObjectComponentLoaderComponent } from '../../../../../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { FieldRenderingType } from '../field-rendering-type';
import { SearchresultComponent } from './searchresult.component';

describe('SearchresultComponent', () => {
  let component: SearchresultComponent;
  let fixture: ComponentFixture<SearchresultComponent>;

  const itemService = jasmine.createSpyObj('ItemDataService', {
    findById: jasmine.createSpy('findById'),
  });

  const metadataValue1 = Object.assign(new MetadataValue(), {
    value: 'Related Item 1',
    language: null,
    authority: 'item-uuid-1',
    confidence: 600,
    place: 0,
  });

  const metadataValue2 = Object.assign(new MetadataValue(), {
    value: 'Related Item 2',
    language: null,
    authority: 'item-uuid-2',
    confidence: 600,
    place: 1,
  });

  const metadataValueNoAuthority = Object.assign(new MetadataValue(), {
    value: 'No Authority Value',
    language: null,
    authority: null,
    confidence: -1,
    place: 2,
  });

  const testItem = Object.assign(new Item(), {
    type: 'item',
    metadata: {
      'dc.relation': [metadataValue1, metadataValue2, metadataValueNoAuthority],
    },
    uuid: 'parent-item-uuid',
  });

  const relatedItem1 = Object.assign(new Item(), {
    uuid: 'item-uuid-1',
    type: 'item',
    metadata: {
      'dc.title': [{ value: 'Related Item 1' }],
      'dspace.entity.type': [{ value: 'Publication' }],
    },
  });

  const relatedItem2 = Object.assign(new Item(), {
    uuid: 'item-uuid-2',
    type: 'item',
    metadata: {
      'dc.title': [{ value: 'Related Item 2' }],
      'dspace.entity.type': [{ value: 'Publication' }],
    },
  });

  const mockField: LayoutField = {
    metadata: 'dc.relation',
    label: 'Relations',
    rendering: FieldRenderingType.SEARCHRESULT,
    fieldType: 'METADATA',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        SearchresultComponent,
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: ItemDataService, useValue: itemService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SearchresultComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    itemService.findById.and.callFake((id: string) => {
      if (id === 'item-uuid-1') {
        return createSuccessfulRemoteDataObject$(relatedItem1);
      } else if (id === 'item-uuid-2') {
        return createSuccessfulRemoteDataObject$(relatedItem2);
      }
      return of(null);
    });
    fixture = TestBed.createComponent(SearchresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve authority values to items', fakeAsync(() => {
    flush();
    fixture.detectChanges();

    const items = component.resolvedItems$.getValue();
    expect(items.length).toBe(2);
    expect(items).toContain(relatedItem1);
    expect(items).toContain(relatedItem2);
  }));

  it('should call ItemDataService.findById for each valid authority', fakeAsync(() => {
    flush();
    expect(itemService.findById).toHaveBeenCalledWith('item-uuid-1', true, false, jasmine.any(Object));
    expect(itemService.findById).toHaveBeenCalledWith('item-uuid-2', true, false, jasmine.any(Object));
  }));

  it('should not call ItemDataService.findById for metadata without authority', fakeAsync(() => {
    flush();
    expect(itemService.findById).not.toHaveBeenCalledWith(null, jasmine.anything(), jasmine.anything(), jasmine.anything());
  }));

  it('should render ds-listable-object-component-loader for each resolved item', fakeAsync(() => {
    flush();
    fixture.detectChanges();

    const loaders = fixture.debugElement.queryAll(By.css('ds-listable-object-component-loader'));
    expect(loaders.length).toBe(2);
  }));

  describe('when no metadata values have authority', () => {
    beforeEach(() => {
      const fieldNoAuthority: LayoutField = {
        ...mockField,
        metadata: 'dc.description',
      };
      const itemNoAuthority = Object.assign(new Item(), {
        type: 'item',
        metadata: {
          'dc.description': [metadataValueNoAuthority],
        },
        uuid: 'parent-item-uuid',
      });

      component.field = fieldNoAuthority;
      component.item = itemNoAuthority;
      component.ngOnInit();
    });

    it('should have no resolved items', fakeAsync(() => {
      flush();
      fixture.detectChanges();

      const items = component.resolvedItems$.getValue();
      expect(items.length).toBe(0);
    }));
  });
});
