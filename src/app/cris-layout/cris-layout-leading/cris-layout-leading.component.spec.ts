import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ContextMenuComponent } from '../../shared/context-menu/context-menu.component';
import { CrisLayoutMatrixComponent } from '../cris-layout-matrix/cris-layout-matrix.component';
import { CrisLayoutLeadingComponent } from './cris-layout-leading.component';

describe('CrisLayoutLeadingComponent', () => {
  let component: CrisLayoutLeadingComponent;
  let fixture: ComponentFixture<CrisLayoutLeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisLayoutLeadingComponent],
    })
      .overrideComponent(CrisLayoutLeadingComponent, { remove: { imports: [ContextMenuComponent, CrisLayoutMatrixComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutLeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
