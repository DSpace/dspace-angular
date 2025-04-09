import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../app.reducer';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../core/shared/item.model';
import { DSONameServiceMock } from '../../mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../mocks/mock-trucatable.service';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { ItemInfo } from '../../testing/relationships-mocks';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { RelationshipsItemsActionsComponent } from './relationships-items-actions/relationships-items-actions.component';
import { RelationshipsListComponent } from './relationships-list.component';

describe('RelationshipsListComponent', () => {
  let component: RelationshipsListComponent;
  let fixture: ComponentFixture<RelationshipsListComponent>;
  let store: Store<AppState>;
  let mockStore: MockStore<AppState>;

  const initialState = {
    editItemRelationships: {
      pendingChanges: true,
    },
  };

  let de: DebugElement;

  const item = Object.assign( new Item(), ItemInfo.payload);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RelationshipsListComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RelationshipsListComponent, { remove: { imports: [RelationshipsItemsActionsComponent] } }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    mockStore = store as MockStore<AppState>;
    fixture = TestBed.createComponent(RelationshipsListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty buttons', () => {
    expect(de.query(By.css('.action-buttons'))).toBeNull();
  });

  it('should be empty items', () => {
    expect(de.query(By.css('.item-details-preview'))).toBeNull();
  });

  describe('After inserting item', () => {

    beforeEach(() => {
      component.dso = item;
      component.object = item;
      fixture.detectChanges();
    });

    it('should be with buttons', () => {
      expect(de.query(By.css('.item-details-preview'))).toBeTruthy();
    });

    it('should be with item', () => {
      expect(de.query(By.css('.item-details-preview'))).toBeTruthy();
    });
  });

});
