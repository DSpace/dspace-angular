import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAccessComponent } from './bulk-access.component';

describe('BulkAccessComponent', () => {
  let component: BulkAccessComponent;
  let fixture: ComponentFixture<BulkAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
