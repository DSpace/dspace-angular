import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAccessControlComponent } from './item-access-control.component';

xdescribe('ItemAccessControlComponent', () => {
  let component: ItemAccessControlComponent;
  let fixture: ComponentFixture<ItemAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ItemAccessControlComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
