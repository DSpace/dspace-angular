import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAccessControlSelectBitstreamsModalComponent } from './item-access-control-select-bitstreams-modal.component';

describe('ItemAccessControlSelectBitstreamsModalComponent', () => {
  let component: ItemAccessControlSelectBitstreamsModalComponent;
  let fixture: ComponentFixture<ItemAccessControlSelectBitstreamsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemAccessControlSelectBitstreamsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAccessControlSelectBitstreamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
