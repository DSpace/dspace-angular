import { Item } from '../../../../core/shared/item.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { isNotEmpty } from '../../../../shared/empty.util';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';

/**
 * Create a generic test for an entity-page-fields component using a mockItem and the type of component
 * @param {Item} mockItem     The item to use for testing. The item needs to contain just the metadata necessary to
 *                            execute the tests for it's component.
 * @param component           The type of component to create test cases for.
 * @returns {() => void}      Returns a specDefinition for the test.
 */
export function getEntityPageFieldsTest(mockItem: Item, component) {
  return () => {
    let comp: any;
    let fixture: ComponentFixture<any>;

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
          {provide: SearchFixedFilterService, useValue: {}},
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

    for (const metadata of mockItem.metadata) {
      it(`should be calling a component with metadata field ${metadata.key}`, () => {
        const fields = fixture.debugElement.queryAll(By.css('ds-generic-item-page-field'));
        expect(containsFieldInput(fields, metadata.key)).toBeTruthy();
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
