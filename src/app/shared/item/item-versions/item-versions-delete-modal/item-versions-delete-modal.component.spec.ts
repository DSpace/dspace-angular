import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionsDeleteModalComponent } from './item-versions-delete-modal.component';

describe('ItemVersionsDeleteModalComponent', () => {
  let component: ItemVersionsDeleteModalComponent;
  let fixture: ComponentFixture<ItemVersionsDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemVersionsDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
