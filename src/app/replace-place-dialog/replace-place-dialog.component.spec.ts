import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacePlaceDialogComponent } from './replace-place-dialog.component';

describe('ReplacePlaceDialogComponent', () => {
  let component: ReplacePlaceDialogComponent;
  let fixture: ComponentFixture<ReplacePlaceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplacePlaceDialogComponent]
    });
    fixture = TestBed.createComponent(ReplacePlaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
