import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionedItemComponent } from './versioned-item.component';

describe('VersionedItemComponent', () => {
  let component: VersionedItemComponent;
  let fixture: ComponentFixture<VersionedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionedItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
