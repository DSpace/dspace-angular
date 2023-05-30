import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipsItemsActionsComponent } from './relationships-items-actions.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('RelationshipsItemsActionsComponent', () => {
  let component: RelationshipsItemsActionsComponent;
  let fixture: ComponentFixture<RelationshipsItemsActionsComponent>;
  let store: Store<AppState>;
  let mockStore: MockStore<AppState>;

  const initialState = {
    editItemRelationships: {
      pendingChanges: true
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsItemsActionsComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        provideMockStore({ initialState }),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    mockStore = store as MockStore<AppState>;
    fixture = TestBed.createComponent(RelationshipsItemsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
