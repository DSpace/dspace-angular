import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  SimpleChange,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { AlertComponent } from '../../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { RelationshipsItemsListPreviewComponent } from '../../shared/object-list/relationships-list/relationships-items-list-preview/relationships-items-list-preview.component';
import {
  ItemInfo,
  RelationshipsData,
} from '../../shared/testing/relationships-mocks';
import { RelationshipsSortListComponent } from './relationships-sort-list.component';

describe('RelationshipsSortListComponent', () => {
  let component: RelationshipsSortListComponent;
  let fixture: ComponentFixture<RelationshipsSortListComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RelationshipsSortListComponent,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RelationshipsSortListComponent, { remove: { imports: [ThemedLoadingComponent, RelationshipsItemsListPreviewComponent, AlertComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsSortListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty list of relations', () => {
    expect(de.query(By.css('relationships-sort-list'))).toBeNull();
  });

  it('after init & item is set check that the relationship type is set', () => {
    component.relationships = RelationshipsData;
    component.item = ItemInfo;
    component.ngOnChanges({
      relationships: new SimpleChange(null, RelationshipsData, true),
    });
    fixture.detectChanges();

    expect(de.query(By.css('.relationships-sort-list'))).toBeTruthy();

  });

});
