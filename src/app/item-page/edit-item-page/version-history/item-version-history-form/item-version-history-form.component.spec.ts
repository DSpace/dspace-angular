import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionHistoryFormComponent } from './item-version-history-form.component';

describe('ItemVersionHistoryCreateComponent', () => {
  let component: ItemVersionHistoryFormComponent;
  let fixture: ComponentFixture<ItemVersionHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemVersionHistoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
