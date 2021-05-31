import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { RelationshipsSortListComponent } from './relationships-sort-list.component';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { SharedModule } from '../../shared/shared.module';
import { ItemInfo, RelationshipsData } from '../../shared/testing/relationships-mocks';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Item } from '../../core/shared/item.model';

describe('RelationshipsSortListComponent', () => {
  let component: RelationshipsSortListComponent;
  let fixture: ComponentFixture<RelationshipsSortListComponent>;
  let de: DebugElement;

  const store: Store = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    select: observableOf(true),
    pipe: () => {}
    /* tslint: enable: no-empty */
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsSortListComponent ],
      imports : [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: Store, useValue: store },
      ]
      // schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
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
    fixture.detectChanges();
    // console.log(component);
    console.log(de.query(By.css('.relationships-sort-list')));
    expect(de.query(By.css('.relationships-sort-list'))).toBeTruthy();

  });

});
