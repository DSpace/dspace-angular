import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { DynamicLayoutMatrixComponent } from '../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { DynamicLayoutLeadingComponent } from './dynamic-layout-leading.component';

describe('DynamicLayoutLeadingComponent', () => {
  let component: DynamicLayoutLeadingComponent;
  let fixture: ComponentFixture<DynamicLayoutLeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLayoutLeadingComponent],
    })
      .overrideComponent(DynamicLayoutLeadingComponent, { remove: { imports: [DynamicLayoutMatrixComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutLeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
