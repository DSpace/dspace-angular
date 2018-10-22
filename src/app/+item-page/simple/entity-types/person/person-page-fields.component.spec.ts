import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { isNotEmpty } from '../../../../shared/empty.util';
import { PersonPageFieldsComponent } from './person-page-fields.component';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';

let comp: PersonPageFieldsComponent;
let fixture: ComponentFixture<PersonPageFieldsComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'person.identifier.email',
      language: 'en_US',
      value: 'fake@email.com'
    },
    {
      key: 'person.identifier.orcid',
      language: 'en_US',
      value: 'ORCID-1'
    },
    {
      key: 'person.identifier.birthdate',
      language: 'en_US',
      value: '1993'
    },
    {
      key: 'person.identifier.staffid',
      language: 'en_US',
      value: '1'
    },
    {
      key: 'person.identifier.jobtitle',
      language: 'en_US',
      value: 'Developer'
    },
    {
      key: 'person.identifier.lastname',
      language: 'en_US',
      value: 'Doe'
    },
    {
      key: 'person.identifier.firstname',
      language: 'en_US',
      value: 'John'
    }]
});

describe('PersonPageFieldsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [PersonPageFieldsComponent, GenericItemPageFieldComponent, TruncatePipe],
      providers: [
        {provide: ITEM, useValue: mockItem},
        {provide: ItemDataService, useValue: {}},
        {provide: SearchFixedFilterService, useValue: {}},
        {provide: TruncatableService, useValue: {}}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PersonPageFieldsComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonPageFieldsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  for (const metadata of mockItem.metadata) {
    it(`should be calling a component with metadata field ${metadata.key}`, () => {
      const fields = fixture.debugElement.queryAll(By.css('.item-page-fields'));
      expect(containsFieldInput(fields, metadata.key)).toBeTruthy();
    });
  }
});

function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
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
