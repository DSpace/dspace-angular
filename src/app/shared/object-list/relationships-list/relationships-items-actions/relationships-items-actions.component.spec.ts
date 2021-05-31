import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipsItemsActionsComponent } from './relationships-items-actions.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';

describe('RelationshipsItemsActionsComponent', () => {
  let component: RelationshipsItemsActionsComponent;
  let fixture: ComponentFixture<RelationshipsItemsActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipsItemsActionsComponent ],
      imports : [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipsItemsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
