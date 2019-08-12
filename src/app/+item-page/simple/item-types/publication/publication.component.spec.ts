import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from '../shared/item.component.spec';
import { PublicationComponent } from './publication.component';
import { of as observableOf } from 'rxjs';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: new MetadataMap(),
  relationships: createRelationshipsObservable()
});

describe('PublicationComponent', () => {
  let comp: PublicationComponent;
  let fixture: ComponentFixture<PublicationComponent>;

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
      declarations: [PublicationComponent, GenericItemPageFieldComponent, TruncatePipe],
      providers: [
        {provide: ITEM, useValue: mockItem},
        {provide: ItemDataService, useValue: {}},
        {provide: SearchFixedFilterService, useValue: searchFixedFilterServiceStub},
        {provide: TruncatableService, useValue: {}}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PublicationComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PublicationComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should contain a component to display the date', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-date-field'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
  });

  it('should contain a component to display the author', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-author-field'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
  });

  it('should contain a component to display the abstract', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-abstract-field'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
  });

  it('should contain a component to display the uri', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-uri-field'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
  });

  it('should contain a component to display the collections', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-collections'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
  });

});
