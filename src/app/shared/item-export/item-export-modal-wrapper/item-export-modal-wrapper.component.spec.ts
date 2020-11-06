import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExportModalWrapperComponent } from './item-export-modal-wrapper.component';

describe('ItemExportModalWrapperComponent', () => {
  let component: ItemExportModalWrapperComponent;
  let fixture: ComponentFixture<ItemExportModalWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExportModalWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
