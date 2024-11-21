import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { AppState } from '../../../../app.reducer';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { RelationshipsItemsActionsComponent } from './relationships-items-actions.component';

describe('RelationshipsItemsActionsComponent', () => {
  let component: RelationshipsItemsActionsComponent;
  let fixture: ComponentFixture<RelationshipsItemsActionsComponent>;
  let store: Store<AppState>;
  let mockStore: MockStore<AppState>;

  const initialState = {
    editItemRelationships: {
      pendingChanges: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RelationshipsItemsActionsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
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
