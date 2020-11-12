import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExportComponent } from './item-export.component';

describe('ItemExportComponent', () => {
  let component: ItemExportComponent;
  let fixture: ComponentFixture<ItemExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
