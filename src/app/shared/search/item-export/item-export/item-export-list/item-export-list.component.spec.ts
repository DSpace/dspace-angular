import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExportListComponent } from './item-export-list.component';

describe('ItemExportListComponent', () => {
  let component: ItemExportListComponent;
  let fixture: ComponentFixture<ItemExportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemExportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
