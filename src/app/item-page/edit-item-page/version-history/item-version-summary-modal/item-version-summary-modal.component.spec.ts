import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionSummaryModalComponent } from './item-version-summary-modal.component';

describe('ItemVersionSummaryModalComponent', () => {
  let component: ItemVersionSummaryModalComponent;
  let fixture: ComponentFixture<ItemVersionSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemVersionSummaryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
