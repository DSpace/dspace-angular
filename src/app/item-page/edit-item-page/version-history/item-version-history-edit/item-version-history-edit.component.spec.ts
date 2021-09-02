import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionHistoryEditComponent } from './item-version-history-edit.component';

describe('ItemVersionHistoryCreateComponent', () => {
  let component: ItemVersionHistoryEditComponent;
  let fixture: ComponentFixture<ItemVersionHistoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemVersionHistoryEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionHistoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
