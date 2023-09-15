import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPageMetricsFieldComponent } from './item-page-metrics-field.component';

describe('ItemPageMetricsFieldComponent', () => {
  let component: ItemPageMetricsFieldComponent;
  let fixture: ComponentFixture<ItemPageMetricsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPageMetricsFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPageMetricsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
