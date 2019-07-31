import { Item } from '../../../../core/shared/item.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { isNotEmpty } from '../../../../shared/empty.util';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ItemComponent } from './item.component';
import { of as observableOf } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { Observable } from 'rxjs/internal/Observable';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadataMap, MetadataValue } from '../../../../core/shared/metadata.models';
import { compareArraysUsing, compareArraysUsingIds } from './item-relationships-utils';

/**
 * Create a generic test for an item-page-fields component using a mockItem and the type of component
 * @param {Item} mockItem     The item to use for testing. The item needs to contain just the metadata necessary to
 *                            execute the tests for it's component.
 * @param component           The type of component to create test cases for.
 * @returns {() => void}      Returns a specDefinition for the test.
 */
export function getItemPageFieldsTest(mockItem: Item, component) {
  return () => {
    let comp: any;
    let fixture: ComponentFixture<any>;

    const searchFixedFilterServiceStub = {
      /* tslint:disable:no-empty */
      getQueryByRelations: () => {}
      /* tslint:enable:no-empty */
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })],
        declarations: [component, GenericItemPageFieldComponent, TruncatePipe],
        providers: [
          {provide: ITEM, useValue: mockItem},
          {provide: ItemDataService, useValue: {}},
          {provide: SearchFixedFilterService, useValue: searchFixedFilterServiceStub},
          {provide: TruncatableService, useValue: {}}
        ],

        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(component, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(component);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    }));

    for (const key of Object.keys(mockItem.metadata)) {
      it(`should be calling a component with metadata field ${key}`, () => {
        const fields = fixture.debugElement.queryAll(By.css('ds-generic-item-page-field'));
        expect(containsFieldInput(fields, key)).toBeTruthy();
      });
    }
  }
}

/**
 * Checks whether in a list of debug elements, at least one of them contains a specific metadata key in their
 * fields property.
 * @param {DebugElement[]} fields   List of debug elements to check
 * @param {string} metadataKey      A metadata key to look for
 * @returns {boolean}
 */
export function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
  for (const field of fields) {
    const fieldComp = field.componentInstance;
    if (isNotEmpty(fieldComp.fields)) {
      if (fieldComp.fields.indexOf(metadataKey) > -1) {
        return true;
      }
    }
  }
  return false;
}

export function createRelationshipsObservable() {
  return observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), [
    Object.assign(new Relationship(), {
      relationshipType: observableOf(new RemoteData(false, false, true, null, new RelationshipType())),
      leftItem: observableOf(new RemoteData(false, false, true, null, new Item())),
      rightItem: observableOf(new RemoteData(false, false, true, null, new Item()))
    })
  ])));
}
describe('ItemComponent', () => {
  const arr1 = [
    {
      id: 1,
      name: 'test'
    },
    {
      id: 2,
      name: 'another test'
    },
    {
      id: 3,
      name: 'one last test'
    }
  ];
  const arrWithWrongId = [
    {
      id: 1,
      name: 'test'
    },
    {
      id: 5,  // Wrong id on purpose
      name: 'another test'
    },
    {
      id: 3,
      name: 'one last test'
    }
  ];
  const arrWithWrongName = [
    {
      id: 1,
      name: 'test'
    },
    {
      id: 2,
      name: 'wrong test'  // Wrong name on purpose
    },
    {
      id: 3,
      name: 'one last test'
    }
  ];
  const arrWithDifferentOrder = [arr1[0], arr1[2], arr1[1]];
  const arrWithOneMore = [...arr1, {
    id: 4,
    name: 'fourth test'
  }];
  const arrWithAddedProperties = [
    {
      id: 1,
      name: 'test',
      extra: 'extra property'
    },
    {
      id: 2,
      name: 'another test',
      extra: 'extra property'
    },
    {
      id: 3,
      name: 'one last test',
      extra: 'extra property'
    }
  ];
  const arrOfPrimitiveTypes = [1, 2, 3, 4];
  const arrOfPrimitiveTypesWithOneWrong = [1, 5, 3, 4];
  const arrOfPrimitiveTypesWithDifferentOrder = [1, 3, 2, 4];
  const arrOfPrimitiveTypesWithOneMore = [1, 2, 3, 4, 5];

  describe('when calling compareArraysUsing', () => {

    describe('and comparing by id', () => {
      const compare = compareArraysUsing<any>((o) => o.id);

      it('should return true when comparing the same array', () => {
        expect(compare(arr1, arr1)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arr1, arrWithDifferentOrder)).toBeTruthy();
      });

      it('should return true regardless of other properties being different', () => {
        expect(compare(arr1, arrWithWrongName)).toBeTruthy();
      });

      it('should return true regardless of extra properties', () => {
        expect(compare(arr1, arrWithAddedProperties)).toBeTruthy();
      });

      it('should return false when the ids don\'t match', () => {
        expect(compare(arr1, arrWithWrongId)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arr1, arrWithOneMore)).toBeFalsy();
      });
    });

    describe('and comparing by name', () => {
      const compare = compareArraysUsing<any>((o) => o.name);

      it('should return true when comparing the same array', () => {
        expect(compare(arr1, arr1)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arr1, arrWithDifferentOrder)).toBeTruthy();
      });

      it('should return true regardless of other properties being different', () => {
        expect(compare(arr1, arrWithWrongId)).toBeTruthy();
      });

      it('should return true regardless of extra properties', () => {
        expect(compare(arr1, arrWithAddedProperties)).toBeTruthy();
      });

      it('should return false when the names don\'t match', () => {
        expect(compare(arr1, arrWithWrongName)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arr1, arrWithOneMore)).toBeFalsy();
      });
    });

    describe('and comparing by full objects', () => {
      const compare = compareArraysUsing<any>((o) => o);

      it('should return true when comparing the same array', () => {
        expect(compare(arr1, arr1)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arr1, arrWithDifferentOrder)).toBeTruthy();
      });

      it('should return false when extra properties are added', () => {
        expect(compare(arr1, arrWithAddedProperties)).toBeFalsy();
      });

      it('should return false when the ids don\'t match', () => {
        expect(compare(arr1, arrWithWrongId)).toBeFalsy();
      });

      it('should return false when the names don\'t match', () => {
        expect(compare(arr1, arrWithWrongName)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arr1, arrWithOneMore)).toBeFalsy();
      });
    });

    describe('and comparing with primitive objects as source', () => {
      const compare = compareArraysUsing<any>((o) => o);

      it('should return true when comparing the same array', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypes)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypesWithDifferentOrder)).toBeTruthy();
      });

      it('should return false when at least one is wrong', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypesWithOneWrong)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypesWithOneMore)).toBeFalsy();
      });
    });

  });

  describe('when calling compareArraysUsingIds', () => {
    const compare = compareArraysUsingIds();

    it('should return true when comparing the same array', () => {
      expect(compare(arr1 as any, arr1 as any)).toBeTruthy();
    });

    it('should return true regardless of the order', () => {
      expect(compare(arr1 as any, arrWithDifferentOrder as any)).toBeTruthy();
    });

    it('should return true regardless of other properties being different', () => {
      expect(compare(arr1 as any, arrWithWrongName as any)).toBeTruthy();
    });

    it('should return true regardless of extra properties', () => {
      expect(compare(arr1 as any, arrWithAddedProperties as any)).toBeTruthy();
    });

    it('should return false when the ids don\'t match', () => {
      expect(compare(arr1 as any, arrWithWrongId as any)).toBeFalsy();
    });

    it('should return false when the sizes don\'t match', () => {
      expect(compare(arr1 as any, arrWithOneMore as any)).toBeFalsy();
    });
  });

  describe('when calling buildRepresentations', () => {
    let comp: ItemComponent;
    let fixture: ComponentFixture<ItemComponent>;

    const metadataField = 'dc.contributor.author';
    const relatedItem = Object.assign(new Item(), {
      id: '2',
      metadata: Object.assign(new MetadataMap(), {
        'dc.title': [
          {
            language: 'en_US',
            value: 'related item'
          }
        ]
      })
    });
    const mockItem = Object.assign(new Item(), {
      id: '1',
      uuid: '1',
      metadata: new MetadataMap()
    });
    mockItem.relationships = observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), [
      Object.assign(new Relationship(), {
        uuid: '123',
        id: '123',
        leftItem: observableOf(new RemoteData(false, false, true, null, mockItem)),
        rightItem: observableOf(new RemoteData(false, false, true, null, relatedItem)),
        relationshipType: observableOf(new RemoteData(false, false, true, null, new RelationshipType()))
      })
    ])));
    mockItem.metadata[metadataField] = [
      {
        value: 'Second value',
        place: 1
      },
      {
        value: 'Third value',
        place: 2,
        authority: 'virtual::123'
      },
      {
        value: 'First value',
        place: 0
      },
      {
        value: 'Fourth value',
        place: 3,
        authority: '123'
      }
    ] as MetadataValue[];
    const mockItemDataService = Object.assign({
      findById: (id) => {
        if (id === relatedItem.id) {
          return observableOf(new RemoteData(false, false, true, null, relatedItem))
        }
      }
    }) as ItemDataService;

    let representations: Observable<MetadataRepresentation[]>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }), BrowserAnimationsModule],
        declarations: [ItemComponent, VarDirective],
        providers: [
          {provide: ITEM, useValue: mockItem}
        ],

        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(ItemComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(ItemComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
      representations = comp.buildRepresentations('bogus', metadataField);
    }));

    it('should contain exactly 4 metadata-representations', () => {
      representations.subscribe((reps: MetadataRepresentation[]) => {
        expect(reps.length).toEqual(4);
      });
    });

    it('should have all the representations in the correct order', () => {
      representations.subscribe((reps: MetadataRepresentation[]) => {
        expect(reps[0].getValue()).toEqual('First value');
        expect(reps[1].getValue()).toEqual('Second value');
        expect(reps[2].getValue()).toEqual('related item');
        expect(reps[3].getValue()).toEqual('Fourth value');
      });
    });

    it('should have created the correct MetadatumRepresentation and ItemMetadataRepresentation objects for the correct Metadata', () => {
      representations.subscribe((reps: MetadataRepresentation[]) => {
        expect(reps[0] instanceof MetadatumRepresentation).toEqual(true);
        expect(reps[1] instanceof MetadatumRepresentation).toEqual(true);
        expect(reps[2] instanceof ItemMetadataRepresentation).toEqual(true);
        expect(reps[3] instanceof MetadatumRepresentation).toEqual(true);
      });
    });
  })

});
