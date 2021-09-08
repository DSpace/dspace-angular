import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionsSummaryModalComponent } from './item-versions-summary-modal.component';

describe('ItemVersionsSummaryModalComponent', () => {
  let component: ItemVersionsSummaryModalComponent;
  let fixture: ComponentFixture<ItemVersionsSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemVersionsSummaryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
